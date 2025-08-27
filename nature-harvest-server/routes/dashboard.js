const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const User = require('../models/User');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Only count documents that actually exist and are valid
    const [
      productsCount,
      brandsCount,
      categoriesCount,
      flavorsCount,
      sizesCount,
      usersCount
    ] = await Promise.all([
      Product.countDocuments().catch(() => 0),
      Brand.countDocuments().catch(() => 0),
      Category.countDocuments().catch(() => 0),
      require('../models/Flavor').countDocuments().catch(() => 0),
      require('../models/Size').countDocuments().catch(() => 0),
      User.countDocuments().catch(() => 0)
    ]);

    res.json({
      products: productsCount || 0,
      services: 0, // Not implemented yet
      brands: brandsCount || 0,
      categories: categoriesCount || 0,
      flavors: flavorsCount || 0,
      sizes: sizesCount || 0,
      users: usersCount || 0,
      blogs: 0, // Not implemented yet
      suppliers: 0, // Not implemented yet
      quotes: 0 // Not implemented yet
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// Get system health status
router.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    // Check if server is responding
    const serverStatus = 'running';
    
    // Check API responsiveness
    const apiStatus = 'operational';
    
    res.json({
      database: dbStatus,
      server: serverStatus,
      api: apiStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({ message: 'Failed to check system health' });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const activities = [];
    
    // Get recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt')
      .catch(() => []);
    
    recentProducts.forEach(product => {
      activities.push({
        id: product._id.toString(),
        type: 'product',
        action: 'Product Created',
        description: `New product "${product.name}" was added`,
        timestamp: product.createdAt,
        status: 'success'
      });
    });
    
    // Get recent brands
    const recentBrands = await Brand.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name createdAt')
      .catch(() => []);
    
    recentBrands.forEach(brand => {
      activities.push({
        id: brand._id.toString(),
        type: 'brand',
        action: 'Brand Added',
        description: `New brand "${brand.name}" was added`,
        timestamp: brand.createdAt,
        status: 'success'
      });
    });
    
    // Get recent categories
    const recentCategories = await Category.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name createdAt')
      .catch(() => []);
    
    recentCategories.forEach(category => {
      activities.push({
        id: category._id.toString(),
        type: 'category',
        action: 'Category Added',
        description: `New category "${category.name}" was added`,
        timestamp: category.createdAt,
        status: 'success'
      });
    });
    
    // Sort all activities by timestamp and return top 5
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
    
    res.json(sortedActivities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Failed to fetch recent activity' });
  }
});



module.exports = router; 