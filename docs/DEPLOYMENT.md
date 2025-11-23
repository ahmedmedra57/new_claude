# Deployment Guide

This document provides comprehensive instructions for deploying the Industrial Energy Management System to various environments.

## Table of Contents

- [Overview](#overview)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Deployment Environments](#deployment-environments)
- [Production Deployment](#production-deployment)
- [Continuous Integration/Deployment](#continuous-integrationdeployment)
- [Monitoring and Logging](#monitoring-and-logging)
- [Rollback Procedures](#rollback-procedures)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

The application is a React-based SPA (Single Page Application) that can be deployed to various hosting environments including:

- Static hosting (AWS S3, Netlify, Vercel)
- Web servers (Nginx, Apache)
- Container platforms (Docker, Kubernetes)
- Cloud platforms (AWS, Azure, GCP)

## Environment Configuration

### Environment Variables

The application uses environment variables for configuration. Create appropriate `.env` files for each environment:

#### Development (.env.development)
```bash
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_AMAZON_S3_URL=https://dev-bucket.s3.amazonaws.com
REACT_APP_WEBSOCKET_URL=ws://localhost:8000
REACT_APP_ENABLE_LOGGING=true
NODE_ENV=development
```

#### Staging (.env.staging)
```bash
REACT_APP_BASE_URL=https://api.staging.example.com
REACT_APP_AMAZON_S3_URL=https://staging-bucket.s3.amazonaws.com
REACT_APP_WEBSOCKET_URL=wss://api.staging.example.com
REACT_APP_ENABLE_LOGGING=true
NODE_ENV=production
```

#### Production (.env.production)
```bash
REACT_APP_BASE_URL=https://api.production.example.com
REACT_APP_AMAZON_S3_URL=https://prod-bucket.s3.amazonaws.com
REACT_APP_WEBSOCKET_URL=wss://api.production.example.com
REACT_APP_ENABLE_LOGGING=false
NODE_ENV=production
```

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REACT_APP_BASE_URL` | Yes | Backend API base URL | `https://api.example.com` |
| `REACT_APP_AMAZON_S3_URL` | Yes | S3 bucket URL for file uploads | `https://bucket.s3.amazonaws.com` |
| `REACT_APP_WEBSOCKET_URL` | No | WebSocket server URL (defaults to API URL) | `wss://api.example.com` |
| `REACT_APP_ENABLE_LOGGING` | No | Enable console logging | `true` or `false` |
| `NODE_ENV` | Yes | Environment mode | `development` or `production` |

## Build Process

### Development Build

For development with hot reloading:

```bash
npm start
```

This starts the development server on `http://localhost:3000`

### Production Build

Create optimized production build:

```bash
npm run build
```

This creates a `build/` directory with optimized assets:

```
build/
├── index.html           # Entry HTML file
├── static/
│   ├── css/             # Compiled CSS (minified)
│   ├── js/              # Compiled JS (minified, code-split)
│   └── media/           # Images and other assets
├── asset-manifest.json  # Asset mapping
└── manifest.json        # PWA manifest
```

### Build Optimization

The build process automatically includes:

- **Minification**: JavaScript and CSS minification
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Image compression and optimization
- **Source Maps**: Generated for debugging (production)
- **Cache Busting**: Content hashing for cache invalidation

### Build Analysis

Analyze bundle size:

```bash
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

Or add to package.json:

```json
{
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

## Deployment Environments

### Static Hosting (AWS S3 + CloudFront)

#### 1. Build the Application

```bash
npm run build
```

#### 2. Create S3 Bucket

```bash
aws s3 mb s3://your-app-bucket
```

#### 3. Configure Bucket for Static Website

```bash
aws s3 website s3://your-app-bucket \
  --index-document index.html \
  --error-document index.html
```

#### 4. Upload Build Files

```bash
aws s3 sync build/ s3://your-app-bucket \
  --delete \
  --cache-control max-age=31536000,public
```

#### 5. Set index.html Cache

```bash
aws s3 cp s3://your-app-bucket/index.html s3://your-app-bucket/index.html \
  --metadata-directive REPLACE \
  --cache-control max-age=0,no-cache,no-store,must-revalidate \
  --content-type text/html
```

#### 6. Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name your-app-bucket.s3.amazonaws.com \
  --default-root-object index.html
```

#### 7. Configure CloudFront Error Pages

Set error responses to redirect to `index.html` for SPA routing:
- 403 → 200 → /index.html
- 404 → 200 → /index.html

### Netlify Deployment

#### Method 1: Git Integration

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Set environment variables in Netlify dashboard
4. Deploy automatically on git push

#### Method 2: CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

#### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "16"
```

### Vercel Deployment

#### Method 1: Git Integration

1. Import project to Vercel
2. Configure build settings (auto-detected for Create React App)
3. Set environment variables
4. Deploy automatically on git push

#### Method 2: CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Build and Run

```bash
# Build image
docker build -t energy-management-app .

# Run container
docker run -p 80:80 \
  -e REACT_APP_BASE_URL=https://api.example.com \
  energy-management-app
```

#### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_BASE_URL=https://api.example.com
      - REACT_APP_AMAZON_S3_URL=https://bucket.s3.amazonaws.com
    restart: unless-stopped
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] Bundle size analyzed and optimized
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Backup plan in place
- [ ] Rollback plan prepared

### Deployment Steps

1. **Create Release Branch**
```bash
git checkout -b release/v1.0.0
```

2. **Update Version**
```bash
npm version patch  # or minor, major
```

3. **Run Tests**
```bash
npm test
npm run build
```

4. **Tag Release**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

5. **Deploy**
```bash
# Deploy to staging first
npm run deploy:staging

# Test staging
# If successful, deploy to production
npm run deploy:production
```

6. **Verify Deployment**
- Check application loads
- Test critical user flows
- Verify API connectivity
- Check error tracking
- Monitor performance metrics

### Post-Deployment

- Monitor error logs
- Check performance metrics
- Verify user access
- Update status page
- Notify stakeholders

## Continuous Integration/Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        env:
          REACT_APP_BASE_URL: ${{ secrets.REACT_APP_BASE_URL }}
          REACT_APP_AMAZON_S3_URL: ${{ secrets.REACT_APP_AMAZON_S3_URL }}
        run: npm run build

      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-east-1'
          SOURCE_DIR: 'build'

      - name: Invalidate CloudFront
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: '/*'
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:16
  script:
    - npm ci
    - npm test

build:
  stage: build
  image: node:16
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/

deploy_production:
  stage: deploy
  image: python:3.9
  only:
    - main
  before_script:
    - pip install awscli
  script:
    - aws s3 sync build/ s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
```

## Monitoring and Logging

### Error Tracking (Sentry)

```javascript
// src/index.js
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Google Analytics)

```javascript
// src/analytics.js
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
```

### Application Performance Monitoring

```javascript
// src/performance.js
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

## Rollback Procedures

### Quick Rollback (CloudFront + S3)

1. **Identify previous working version**:
```bash
aws s3 ls s3://your-app-bucket/releases/
```

2. **Copy previous version to main bucket**:
```bash
aws s3 sync s3://your-app-bucket/releases/v1.0.0/ \
  s3://your-app-bucket/ --delete
```

3. **Invalidate CloudFront cache**:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Git-Based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific version
git reset --hard <commit-hash>
git push --force origin main
```

### Docker Rollback

```bash
# Pull previous image version
docker pull your-registry/app:v1.0.0

# Stop current container
docker stop app-container

# Run previous version
docker run -d --name app-container \
  your-registry/app:v1.0.0
```

## Performance Optimization

### Build Optimizations

1. **Code Splitting**:
```javascript
// Lazy load routes
const MasterControl = lazy(() => import('./components/masterControl'));

<Suspense fallback={<Loading />}>
  <MasterControl />
</Suspense>
```

2. **Bundle Analysis**:
```bash
npm install --save-dev webpack-bundle-analyzer
```

3. **Compression**:
```nginx
# nginx gzip configuration
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript
           application/x-javascript application/xml+rss
           application/json application/javascript;
```

### CDN Configuration

1. **Cache Headers**:
```nginx
location /static/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location / {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

2. **CloudFront Cache Behaviors**:
- `/static/*` - Cache for 1 year
- `/index.html` - No cache
- `/*` - Cache with short TTL

## Security Considerations

### Content Security Policy

```html
<!-- In public/index.html -->
<meta http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.example.com wss://api.example.com;
  ">
```

### Security Headers

```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### HTTPS Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

## Troubleshooting

### Common Deployment Issues

#### Issue: Blank page after deployment

**Possible Causes**:
- Incorrect `homepage` in package.json
- Missing environment variables
- Routing configuration issue

**Solutions**:
```json
// package.json
{
  "homepage": "."  // For relative paths
}
```

#### Issue: API calls failing

**Possible Causes**:
- Incorrect `REACT_APP_BASE_URL`
- CORS issues
- Network configuration

**Solutions**:
- Verify environment variables
- Check CORS configuration on backend
- Test API endpoints directly

#### Issue: Assets not loading

**Possible Causes**:
- Incorrect base path
- Cache issues
- CDN not configured

**Solutions**:
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id ID --paths "/*"
```

### Debugging Production Issues

1. **Enable source maps** (temporarily):
```javascript
// In build config
GENERATE_SOURCEMAP=true npm run build
```

2. **Check console logs** (if enabled):
```javascript
if (process.env.REACT_APP_ENABLE_LOGGING === 'true') {
  console.log('Debug info:', data);
}
```

3. **Use error tracking**:
- Review Sentry errors
- Check application logs
- Monitor API responses

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Code review completed
- [ ] Security scan completed
- [ ] Performance tested
- [ ] Environment variables set
- [ ] Build successful
- [ ] Changelog updated

### Deployment
- [ ] Deploy to staging
- [ ] Smoke test staging
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Invalidate caches

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify critical flows
- [ ] Update documentation
- [ ] Notify team

## Conclusion

This deployment guide provides comprehensive instructions for deploying the Industrial Energy Management System across various environments. Follow the appropriate section for your deployment target and ensure all security and performance best practices are implemented.

For additional support:
- Review error logs
- Check monitoring dashboards
- Consult team documentation
- Contact DevOps team

Remember to always test deployments in staging before production!
