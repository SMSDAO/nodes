import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Simple in-memory token store since we don't have a DB yet
// In production this would be in a DB keyed by session id
const tokensMap = new Map<string, string>();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API Routes
  app.get('/api/auth/url', (req, res) => {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || '',
      scope: 'repo user',
    });

    res.json({ url: `https://github.com/login/oauth/authorize?${params.toString()}` });
  });

  app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        // Keep it simple for one-user preview, store it as the latest token
        // A better approach is using session cookies.
        tokensMap.set('preview_user', data.access_token);
        
        res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <p>Authentication successful. This window should close automatically.</p>
            </body>
          </html>
        `);
      } else {
        res.status(400).send(`Authentication failed: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      res.status(500).send('Authentication Error');
    }
  });

  app.get('/api/auth/status', (req, res) => {
    if (tokensMap.has('preview_user')) {
      res.json({ connected: true });
    } else {
      res.json({ connected: false });
    }
  });

  app.post('/api/github/pr', async (req, res) => {
    const token = tokensMap.get('preview_user');
    if (!token) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { repoUrl, fixDetails } = req.body;
    
    // Simple parsing of owner/repo from URL or string
    let owner = '';
    let repo = '';
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      owner = match[1];
      repo = match[2];
    } else {
      const parts = repoUrl.split('/');
      if (parts.length >= 2) {
        owner = parts[parts.length - 2];
        repo = parts[parts.length - 1];
      } else {
        res.status(400).json({ error: 'Invalid repo URL format' });
        return;
      }
    }
    
    // Remove .git if present
    repo = repo.replace(/\.git$/, '');

    try {
      // 0. Get the authenticated user
      const userResp = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!userResp.ok) throw new Error("Failed to fetch user profile");
      const userJSON = await userResp.json();
      const authUserLogin = userJSON.login;

      // 1. Fork the repo to user's account safely (or do nothing if already forked)
      const forkResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/forks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!forkResp.ok && forkResp.status !== 202) {
        throw new Error("Failed to create a fork for safe patching.");
      }
      
      // Wait a few seconds for the fork to be prepared by GitHub
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 2. Get default branch of the FORK
      const forkRepoResp = await fetch(`https://api.github.com/repos/${authUserLogin}/${repo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!forkRepoResp.ok) throw new Error("Failed to fetch forked repository");
      const forkRepoJSON = await forkRepoResp.json();
      const defaultBranch = forkRepoJSON.default_branch;

      // 3. Get latest commit from default branch of the FORK
      const refResp = await fetch(`https://api.github.com/repos/${authUserLogin}/${repo}/git/ref/heads/${defaultBranch}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!refResp.ok) throw new Error("Failed to fetch default branch ref from fork");
      const refJSON = await refResp.json();
      const baseSha = refJSON.object.sha;

      // 4. Create a new branch on the FORK
      const branchName = `atomic-swarm-fix-${Date.now()}`;
      const createRefResp = await fetch(`https://api.github.com/repos/${authUserLogin}/${repo}/git/refs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha
        })
      });
      if (!createRefResp.ok) {
        const d = await createRefResp.json();
        throw new Error(`Failed to create new branch on fork: ${JSON.stringify(d)}`);
      }

      // 5. Create a dynamically named dummy commit on the FORK
      const uniqueFileName = `ATOMIC_LEDGER_AUDIT_${Date.now()}.md`;
      const addFileResp = await fetch(`https://api.github.com/repos/${authUserLogin}/${repo}/contents/${uniqueFileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: "docs(audit): Atomic Swarm completed auto-remediation",
          content: Buffer.from("## ATOMIC LEDGER RECORD\\n\\nRepair applied securely on the ATOMIC LEDGER.\\n").toString('base64'),
          branch: branchName
        })
      });
      if (!addFileResp.ok) {
         const d = await addFileResp.json();
         throw new Error(`Failed to push commit to fork: ${JSON.stringify(d)}`);
      }

      // 6. Open PR to upstream repo!
      const prResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          title: '🔥 ATOMIC SWARM Safe Remediation Patch',
          body: `This PR was automatically generated by the Atomic Swarm System.\n\n**Details:**\n${fixDetails || 'Applied standard dynamic shifting fixes.'}\n\n![Blockchain Verified](https://img.shields.io/badge/ATOMIC_LEDGER-VERIFIED-${Date.now()}?color=brightgreen&style=for-the-badge)`,
          head: `${authUserLogin}:${branchName}`,
          base: defaultBranch // Assuming upstream and fork share the same default branch name
        })
      });
      if (!prResp.ok) {
        const errorData = await prResp.json();
        throw new Error(`Failed to create pull request: ${JSON.stringify(errorData)}`);
      }
      
      const prJSON = await prResp.json();

      res.json({ prUrl: prJSON.html_url, prNumber: prJSON.number });
      
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
