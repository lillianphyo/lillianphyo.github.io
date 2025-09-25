# Cloudflare Pages Deployment Guide

This guide will help you deploy your portfolio website to Cloudflare Pages using GitHub Actions.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Domain** (optional): You can use a custom domain or the default `*.pages.dev` subdomain

## Setup Steps

### 1. Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Configure the token with these permissions:
   - **Account**: `Cloudflare Pages:Edit`
   - **Zone**: `Zone:Read` (if using custom domain)
5. Copy the generated token

### 2. Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Copy the Account ID from the right sidebar

### 3. Configure GitHub Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID

### 4. Environment Variables (Optional)

If you want to use environment variables in production, add them in Cloudflare Pages dashboard:

1. Go to your Pages project
2. Navigate to **Settings** → **Environment variables**
3. Add your variables:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
   - `NEXT_PUBLIC_GISCUS_REPO`
   - `NEXT_PUBLIC_GISCUS_REPO_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY`
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`

## Deployment Process

### Automatic Deployment

The GitHub Action will automatically deploy when you:

1. **Push to main branch**: Triggers production deployment
2. **Create pull request**: Creates preview deployment

### Manual Deployment

You can also deploy manually:

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or leave empty)

## Custom Domain Setup

1. In Cloudflare Pages dashboard, go to **Custom domains**
2. Click "Set up a custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Update your domain's nameservers to Cloudflare if not already done

## Build Configuration

The project is configured for static export with:

- **Output**: Static files in `out` directory
- **Images**: Unoptimized (required for static export)
- **Trailing slashes**: Enabled for better routing
- **Security headers**: Configured in `_headers` file
- **Redirects**: Configured in `_redirects` file

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are in `package.json`
2. **404 errors**: Ensure `_redirects` file is properly configured
3. **Environment variables not working**: Check they're set in Cloudflare Pages dashboard
4. **Images not loading**: Verify `images.unoptimized: true` in Next.js config

### Build Logs

Check build logs in:
- GitHub Actions tab for CI/CD issues
- Cloudflare Pages dashboard for deployment issues

## Performance Optimization

The deployment includes:

- **Static generation**: Fast loading times
- **CDN distribution**: Global content delivery
- **Caching headers**: Optimized for static assets
- **Security headers**: Protection against common attacks

## Monitoring

- **Analytics**: Cloudflare Analytics integrated
- **Performance**: Monitor in Cloudflare dashboard
- **Uptime**: Cloudflare's global network ensures high availability

## Support

For issues with:
- **Cloudflare Pages**: [Cloudflare Support](https://support.cloudflare.com)
- **GitHub Actions**: [GitHub Documentation](https://docs.github.com/en/actions)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)