# GitHub Setup Guide

Follow these steps to publish your PacMan game to GitHub.

## Step 1: Initialize Git Repository

```bash
cd /home/bitwise/Desktop/Source_Code/PacMan
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: PacMan game with 2 levels

Features:
- Classic PacMan gameplay
- 2 progressive levels
- Lives system and score tracking
- Power-ups and ghost AI
- Pause/restart functionality
- High score persistence

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it: `pacman-game` (or whatever you prefer)
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 5: Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pacman-game.git
git branch -M main
git push -u origin main
```

## Step 6: Verify

Go to your repository URL:
```
https://github.com/YOUR_USERNAME/pacman-game
```

You should see your PacMan game with the README displayed!

## Optional: Clean Up Backup Files

Before pushing, you might want to remove backup files (they're already in .gitignore):

```bash
rm *.backup
rm test.html
rm *.zip
```

Then commit and push again:

```bash
git add .
git commit -m "Clean up backup files"
git push
```

## Enable GitHub Pages (Optional)

To play your game online:

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Your game will be live at: `https://YOUR_USERNAME.github.io/pacman-game`

**Note:** It may take a few minutes for the site to become available.

## Troubleshooting

### Authentication Error

If you get an authentication error, you may need to:

1. **Use SSH instead of HTTPS:**
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/pacman-game.git
   ```
   (Requires SSH key setup)

2. **Or use a Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with 'repo' scope
   - Use the token as your password when pushing

### Already Initialized Git

If you see "already initialized", skip step 1.

### Permission Denied

Make sure you're the owner of the repository and logged in to GitHub.

---

Need help? Check the [GitHub Docs](https://docs.github.com) or open an issue!
