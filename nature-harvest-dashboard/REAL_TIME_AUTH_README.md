# 🌟 Real-Time Authentication System

Your Nature Harvest Dashboard now uses **real-time authentication** instead of demo credentials, connecting directly to your server's MongoDB database.

## 🚀 **Setup Instructions**

### **1. Start Your Server**
```bash
cd server
npm start
# Server runs on http://localhost:3002
```

### **2. Create Your First Admin User**
```bash
cd server
node create-admin-user.js
```

This will create an admin user with:
- **Email**: `admin@natureharvest.com`
- **Username**: `admin`
- **Password**: `admin123456`
- **Role**: `Admin`

### **3. Start Your Dashboard**
```bash
cd nature-harvest-dashboard
npm start
# Dashboard runs on http://localhost:3000
```

## 🔐 **Authentication Features**

### **Login System**
- ✅ **Real-time validation** against your server
- ✅ **JWT token management** with automatic refresh
- ✅ **Secure password handling** (bcrypt hashed)
- ✅ **Role-based access control** (Admin/Manager)

### **Registration System**
- ✅ **New user creation** with server validation
- ✅ **Password confirmation** and strength validation
- ✅ **Username uniqueness** checking
- ✅ **Email format validation**

### **Security Features**
- ✅ **JWT tokens** with 24-hour expiration
- ✅ **Password hashing** using bcrypt
- ✅ **Input validation** and sanitization
- ✅ **Protected routes** requiring authentication

## 🌐 **API Endpoints Used**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### **Dashboard Data**
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/health` - System health
- `GET /api/dashboard/activity` - Recent activity

### **Data Management**
- `GET /api/products` - Product listing
- `GET /api/categories` - Category management
- `GET /api/brands` - Brand management
- And many more...

## 👥 **User Roles**

### **Admin Role**
- 🔓 **Full access** to all features
- 👥 **User management** capabilities
- 📊 **System administration** tools
- 🗄️ **Database management** access

### **Manager Role**
- 📋 **Product management** access
- 📈 **Dashboard viewing** capabilities
- 📝 **Content editing** permissions
- 🔍 **Data viewing** access

## 🛠️ **Customization Options**

### **Change Default Admin Credentials**
Edit `server/create-admin-user.js`:
```javascript
const adminUser = new User({
  username: 'your-username',
  email: 'your-email@domain.com',
  password: 'your-secure-password',
  role: 'Admin'
});
```

### **Modify User Roles**
Edit `server/models/User.js`:
```javascript
role: {
  type: String,
  enum: ['Admin', 'Manager', 'Editor'], // Add new roles
  default: 'Manager'
}
```

### **Adjust JWT Expiration**
Edit `server/controllers/authController.js`:
```javascript
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '7d' } // Change to 7 days
);
```

## 🔒 **Security Best Practices**

### **Environment Variables**
Create `.env` file in server directory:
```env
JWT_SECRET=your-super-secure-secret-key
MONGODB_URI=mongodb://localhost:27017/nature-harvest
NODE_ENV=development
```

### **Password Requirements**
- Minimum 6 characters
- Consider adding complexity requirements
- Implement password reset functionality

### **Token Management**
- Tokens expire after 24 hours
- Automatic logout on token expiration
- Secure token storage in localStorage

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"User already exists" error**
   - User with that email/username already exists
   - Use different credentials or delete existing user

2. **"Invalid credentials" error**
   - Check email and password spelling
   - Ensure user exists in database

3. **"Server error" during login**
   - Check if MongoDB is running
   - Verify server is started on port 3002

4. **"Database connection failed"**
   - Check MongoDB connection string
   - Ensure MongoDB service is running

### **Database Connection**
```bash
# Check MongoDB status
mongosh
# or
mongo

# List databases
show dbs

# Use your database
use nature-harvest

# List collections
show collections

# Check users
db.users.find()
```

## 🎯 **Next Steps**

1. **Test Authentication**: Login with admin credentials
2. **Create Additional Users**: Use registration form
3. **Customize Roles**: Modify user permissions
4. **Add Features**: Implement password reset, email verification
5. **Monitor Logs**: Check server console for activity

## 📞 **Support**

If you encounter issues:
1. Check server console for error messages
2. Verify MongoDB connection
3. Check network requests in browser DevTools
4. Ensure all environment variables are set

---

**🎉 Congratulations!** Your dashboard now has enterprise-grade, real-time authentication connected to your actual server database! 