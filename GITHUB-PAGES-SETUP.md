# Mudia Stores - GitHub Pages Deployment

This project is configured for GitHub Pages deployment at: `https://davidmudia.github.io/mudia-stores`

## Key Configurations for GitHub Pages

### 1. **package.json**
- `"homepage": "https://davidmudia.github.io/mudia-stores"` - Points to GitHub Pages URL
- `"name": "mudia-stores"` - Updated project name for clarity

### 2. **vite.config.ts**
- `base: '/mudia-stores/'` - Sets the correct base path for GitHub Pages subpath
- This ensures all assets load from the correct path

### 3. **index.html**
- Includes redirect script for 404.html fallback
- Script handles SPA routing for GitHub Pages

### 4. **404.html**
- Custom 404 page that redirects to index.html
- Enables client-side routing without server configuration
- Converts routes to query parameters for redirect

## Deployment Steps

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
   - Ensure GitHub Pages is configured to deploy from the `dist` folder (or root if using docs/)
   - Push the changes to your repository
   - GitHub Actions will automatically deploy, or manually run:
```bash
# If using gh-pages package (optional)
npm run deploy
```

3. Verify deployment:
   - Visit: https://davidmudia.github.io/mudia-stores
   - Check browser console for any asset loading errors

## Troubleshooting

### Issues with asset paths:
- Verify `base` in vite.config.ts matches the repository name
- Check that dist/index.html exists and contains correct script paths

### Routing not working:
- Ensure 404.html is in the root of the dist folder
- Verify GitHub Pages settings point to the correct folder

### Blank page on load:
- Open DevTools (F12) → Console tab
- Check for 404 errors on JS/CSS files
- Verify base path in vite.config.ts

## Testing Locally

To test the production build locally:
```bash
npm run preview
```

This will serve the dist folder and simulate GitHub Pages behavior.
