# Production Setup Guide

## 🚀 Production Server Information

Your Nature Harvest server is deployed at:
**https://nature-harvest-q2ra.vercel.app/**

## 📋 Environment Configuration

### Dashboard Configuration
Create `nature-harvest-dashboard/.env`:
```env
REACT_APP_API_URL=https://nature-harvest-q2ra.vercel.app/api
REACT_APP_DEBUG_MODE=false
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_LOG_LEVEL=error
```

### Website Configuration
Create `nature-harvest-website/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://nature-harvest-q2ra.vercel.app/api
NEXT_PUBLIC_SITE_NAME=Nature Harvest
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DEBUG_MODE=false
```

## 🔧 Quick Setup Commands

### For Dashboard:
```bash
cd nature-harvest-dashboard
cp env.example .env
# Edit .env if needed
npm install
npm start
```

### For Website:
```bash
cd nature-harvest-website
cp env.example .env.local
# Edit .env.local if needed
npm install
npm run dev
```

## 🌐 API Endpoints

Your production API is available at:
- **Base URL**: `https://nature-harvest-q2ra.vercel.app/api`
- **Authentication**: `/api/auth`
- **Products**: `/api/products`
- **Brands**: `/api/brands`
- **Categories**: `/api/categories`
- **Flavors**: `/api/flavors`
- **Sizes**: `/api/sizes`
- **Blogs**: `/api/blogs`
- **Quotes**: `/api/quotes`
- **Services**: `/api/services`
- **Suppliers**: `/api/suppliers`

## 🔐 Security Notes

1. **CORS Configuration**: The server is configured to accept requests from:
   - `https://natureharvest.com`
   - `https://admin.natureharvest.com`
   - `https://nature-harvest-q2ra.vercel.app`
   - Local development URLs (localhost)

2. **JWT Authentication**: Tokens are required for protected endpoints

3. **File Uploads**: Configured for serverless environment with proper error handling

## 🛠️ Development vs Production

| Setting | Development | Production |
|---------|-------------|------------|
| API URL | `http://localhost:3002/api` | `https://nature-harvest-q2ra.vercel.app/api` |
| Debug Mode | `true` | `false` |
| Analytics | `false` | `true` |
| Error Details | `true` | `false` |
| Log Level | `debug` | `error` |

## 📊 Monitoring

- **Server Status**: Check `https://nature-harvest-q2ra.vercel.app/api/health`
- **API Documentation**: Available at `/api-docs` (if enabled)
- **Error Logs**: Check Vercel dashboard for server logs

## 🔄 Deployment Updates

When you update the server:
1. Push changes to your repository
2. Vercel automatically deploys updates
3. The API URL remains the same
4. No client configuration changes needed

## 🚨 Important Notes

1. **Database**: Ensure your MongoDB connection is configured for production
2. **Environment Variables**: Set all required environment variables in Vercel dashboard
3. **File Uploads**: Consider using cloud storage (AWS S3) for production file uploads
4. **SSL**: All traffic is automatically HTTPS via Vercel

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test API endpoints directly
4. Check CORS configuration for your domains

---

**Server URL**: https://nature-harvest-q2ra.vercel.app/
**API Base**: https://nature-harvest-q2ra.vercel.app/api 