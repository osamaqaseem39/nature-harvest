# Environment Setup Guide for Nature Harvest Projects

This guide will help you set up environment variables for all three projects in the Nature Harvest workspace.

## 📁 Project Structure

```
latest/
├── nature-harvest-server/     # Backend API Server
├── nature-harvest-dashboard/  # Admin Dashboard (React)
└── nature-harvest-website/    # Public Website (Next.js)
```

## 🚀 Quick Setup

### 1. Server Environment Setup

```bash
cd nature-harvest-server
cp env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/nature-harvest
JWT_SECRET=your-super-secure-secret-key
PORT=3002
NODE_ENV=development
```

### 2. Dashboard Environment Setup

```bash
cd nature-harvest-dashboard
cp env.example .env
```

Edit `.env` with your configuration:
```env
REACT_APP_API_URL=https://nature-harvest-q2ra.vercel.app/api
REACT_APP_DEBUG_MODE=false
```

### 3. Website Environment Setup

```bash
cd nature-harvest-website
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=https://nature-harvest-q2ra.vercel.app/api
NEXT_PUBLIC_SITE_NAME=Nature Harvest
```

## 📋 Detailed Configuration

### 🔧 Server Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nature-harvest` | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` | ✅ |
| `PORT` | Server port | `3002` | ❌ |
| `NODE_ENV` | Environment mode | `development` | ❌ |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,3001,3002,3003` | ❌ |

**Production Example:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nature-harvest
JWT_SECRET=your-production-secret-key
ALLOWED_ORIGINS=https://natureharvest.com,https://admin.natureharvest.com
```

### 🎛️ Dashboard Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | API server URL | `http://localhost:3002/api` | ✅ |
| `REACT_APP_DEBUG_MODE` | Enable debug mode | `true` | ❌ |
| `REACT_APP_AUTH_TOKEN_KEY` | LocalStorage key for auth token | `authToken` | ❌ |
| `REACT_APP_THEME` | UI theme | `light` | ❌ |

**Production Example:**
```env
REACT_APP_API_URL=https://nature-harvest-q2ra.vercel.app/api
REACT_APP_DEBUG_MODE=false
REACT_APP_ENABLE_ANALYTICS=true
```

### 🌐 Website Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | API server URL | `https://nature-harvest-q2ra.vercel.app/api` | ✅ |
| `NEXT_PUBLIC_SITE_NAME` | Website name | `Nature Harvest` | ❌ |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email | `info@natureharvest.com` | ❌ |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `true` | ❌ |

**Production Example:**
```env
NEXT_PUBLIC_API_URL=https://nature-harvest-q2ra.vercel.app/api
NEXT_PUBLIC_SITE_URL=https://natureharvest.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🔐 Security Best Practices

### 1. JWT Secret
- Use a strong, random secret key
- Minimum 32 characters
- Include letters, numbers, and special characters
- Never commit secrets to version control

### 2. Database Connection
- Use environment-specific connection strings
- Enable authentication in production
- Use connection pooling for better performance

### 3. CORS Configuration
- Only allow necessary origins
- Use HTTPS in production
- Avoid using `*` for allowed origins

### 4. Environment Separation
- Use different databases for different environments
- Use different API keys for external services
- Use different JWT secrets for each environment

## 🛠️ Development Setup

### Local Development Environment

1. **Start MongoDB:**
   ```bash
   # Install MongoDB locally or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Start the Server:**
   ```bash
   cd nature-harvest-server
   npm install
   npm start
   ```

3. **Start the Dashboard:**
   ```bash
   cd nature-harvest-dashboard
   npm install
   npm start
   ```

4. **Start the Website:**
   ```bash
   cd nature-harvest-website
   npm install
   npm run dev
   ```

### Environment File Locations

```
nature-harvest-server/
├── .env                    # Server environment variables

nature-harvest-dashboard/
├── .env                    # Dashboard environment variables

nature-harvest-website/
├── .env.local              # Website environment variables
├── .env.development        # Development-specific variables
├── .env.production         # Production-specific variables
```

## 🚀 Deployment Configuration

### Vercel Deployment

1. **Server (Vercel Functions):**
   - Set environment variables in Vercel dashboard
   - Use production MongoDB URI
   - Set `NODE_ENV=production`

2. **Dashboard (Vercel):**
   - Set `REACT_APP_API_URL=https://nature-harvest-q2ra.vercel.app/api`
   - Disable debug mode
   - Enable analytics if needed

3. **Website (Vercel):**
   - Set `NEXT_PUBLIC_API_URL=https://nature-harvest-q2ra.vercel.app/api`
   - Configure domain settings
   - Enable analytics

### Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  server:
    build: ./nature-harvest-server
    environment:
      - MONGODB_URI=mongodb://mongo:27017/nature-harvest
      - NODE_ENV=production
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🔍 Troubleshooting

### Common Issues

1. **"MongoDB connection failed"**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **"JWT verification failed"**
   - Ensure JWT_SECRET is set correctly
   - Check token expiration
   - Verify token format

3. **"CORS error"**
   - Add your domain to ALLOWED_ORIGINS
   - Check if API URL is correct
   - Verify HTTPS/HTTP protocol

4. **"Environment variable not found"**
   - Check file naming (.env vs .env.local)
   - Restart the application after changes
   - Verify variable names (case-sensitive)

### Validation Scripts

Each project includes validation:

```bash
# Server validation
cd nature-harvest-server
node -e "require('dotenv').config(); console.log('Server env loaded:', !!process.env.MONGODB_URI)"

# Dashboard validation
cd nature-harvest-dashboard
node -e "require('dotenv').config(); console.log('Dashboard env loaded:', !!process.env.REACT_APP_API_URL)"

# Website validation
cd nature-harvest-website
node test-api.js
```

## 📚 Additional Resources

- [MongoDB Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Environment Variables Best Practices](https://12factor.net/config)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🤝 Contributing

When adding new environment variables:

1. Update the example files
2. Update this documentation
3. Add validation if needed
4. Test in all environments
5. Update deployment guides

---

**Note:** Never commit actual `.env` files to version control. Only commit `.env.example` files as templates. 