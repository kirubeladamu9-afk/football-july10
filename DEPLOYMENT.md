# Deployment Guide - Football Governance & Tactics

This guide explains how to deploy the Football Governance & Tactics application to Render.

## Prerequisites

1. Render.com account (https://render.com)
2. GitHub repository access
3. Environment variables configured

## Deployment Steps

### 1. Connect GitHub to Render

1. Log in to your Render account
2. Click "New +" and select "Web Service"
3. Select "Deploy an existing repo" or "Connect a repo"
4. Choose the `kirubeladamu9-afk/football-july9.20` repository
5. Select the appropriate branch (e.g., `ai_main_92a996b4f17249ddb6eb`)

### 2. Configure the Service

**Basic Settings:**
- Name: `football-governance-tactics`
- Environment: `Node`
- Plan: `Standard` (or higher for production)
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 3. Set Environment Variables

In the Render dashboard, add the following environment variables:

```
NODE_ENV=production
NODE_VERSION=18
MYSQL_HOST=<your_mysql_host>
MYSQL_PORT=3306
MYSQL_DATABASE=football_governance_db
MYSQL_USER=<your_mysql_user>
MYSQL_PASSWORD=<your_mysql_password>
MYSQL_URL=mysql://<user>:<password>@<host>:<port>/<database>
MYSQL_PUBLIC_URL=mysql://<user>:<password>@<host>:<port>/<database>
```

### 4. Database Setup (Optional)

If using Render's MySQL service:

1. Create a MySQL database in Render
2. Copy the connection string from Render
3. Update environment variables accordingly
4. Run migrations after first deployment

### 5. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Deploy and start the server

### 6. Post-Deployment

After successful deployment:

1. **Initialize Database** (if first time):
   ```bash
   curl https://your-render-url/api/init-db
   ```

2. **Verify Health**: Check that the site is accessible at your Render URL

3. **Check Logs**: Monitor deployment logs in Render dashboard

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment type | `production` |
| `NODE_VERSION` | Node.js version | `18` |
| `MYSQL_HOST` | Database host | `db.example.com` |
| `MYSQL_PORT` | Database port | `3306` |
| `MYSQL_DATABASE` | Database name | `football_governance_db` |
| `MYSQL_USER` | Database user | `admin` |
| `MYSQL_PASSWORD` | Database password | `secure_password` |
| `MYSQL_URL` | Connection string | `mysql://user:pass@host/db` |

## Database Migrations

The application automatically runs migrations on startup if needed. To manually run:

```bash
npm run db:migrate
```

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Verify `next.config.js` is valid
- Check build logs in Render dashboard

### Database Connection Issues
- Verify MySQL credentials in environment variables
- Check database firewall/security rules
- Ensure database is accessible from Render's IP addresses

### Application Crashes
- Check Render logs for errors
- Verify all environment variables are set
- Ensure database migrations have run

## Continuous Deployment

Render automatically redeploys when:
- Code is pushed to the connected branch
- Environment variables are updated
- Manual redeploy is triggered

To disable automatic deploys:
1. Go to service settings
2. Under "Auto-Deploy", select "Off"

## Custom Domain

To add a custom domain:

1. In Render dashboard, go to your service
2. Click "Custom Domain"
3. Enter your domain (e.g., `football-governance.com`)
4. Update DNS records as instructed by Render
5. SSL certificate will be automatically provisioned

## Monitoring

- Use Render's built-in analytics
- Monitor logs in the dashboard
- Set up error alerts if needed

## Rolling Back

To rollback to a previous deployment:

1. Go to your Render service
2. Find the deployment in "Deploys" history
3. Click "Redeploy" on the desired version

## Performance Optimization

- Use `npm run build` to create optimized production build
- Enable caching in Render settings
- Consider upgrading to Performance plan for high traffic

## Support

- Render Docs: https://render.com/docs
- GitHub Issues: Report bugs in repository
- Email Support: support@render.com

---

**Last Updated**: July 2024
