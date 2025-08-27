const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nature Harvest API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the Nature Harvest application. This API provides endpoints for managing products, flavors, sizes, categories, brands, suppliers, blogs, and user authentication.',
      contact: {
        name: 'Nature Harvest API Support',
        email: 'support@natureharvest.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://natureharvest-server.vercel.app',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:3002',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            username: { type: 'string', description: 'Username' },
            email: { type: 'string', format: 'email', description: 'Email address' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Product ID' },
            title: { type: 'string', description: 'Product title' },
            description: { type: 'string', description: 'Product description' },
            featuredImage: { type: 'string', description: 'Featured image URL' },
            gallery: { type: 'array', items: { type: 'string' }, description: 'Gallery image URLs' },
            brand: { type: 'string', description: 'Brand ID' },
            category: { type: 'string', description: 'Category ID' },
            subCategory: { type: 'string', description: 'Subcategory ID' },
            flavors: { 
              type: 'array', 
              items: { 
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string' }
                }
              },
              description: 'Product flavors'
            },
            sizes: { 
              type: 'array', 
              items: { 
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string' }
                }
              },
              description: 'Product sizes'
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Flavor: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Flavor ID' },
            name: { type: 'string', description: 'Flavor name' },
            description: { type: 'string', description: 'Flavor description' },
            image: { type: 'string', description: 'Flavor image URL' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Size: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Size ID' },
            name: { type: 'string', description: 'Size name' },
            description: { type: 'string', description: 'Size description' },
            image: { type: 'string', description: 'Size image URL' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Brand ID' },
            name: { type: 'string', description: 'Brand name' },
            description: { type: 'string', description: 'Brand description' },
            image: { type: 'string', description: 'Brand image URL' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Category ID' },
            name: { type: 'string', description: 'Category name' },
            description: { type: 'string', description: 'Category description' },
            image: { type: 'string', description: 'Category image URL' },
            parent: { type: 'string', description: 'Parent category ID (for subcategories)' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Blog ID' },
            title: { type: 'string', description: 'Blog title' },
            content: { type: 'string', description: 'Blog content' },
            slug: { type: 'string', description: 'Blog slug' },
            featuredImage: { type: 'string', description: 'Featured image URL' },
            author: { type: 'string', description: 'Author name' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Blog tags' },
            status: { type: 'string', enum: ['draft', 'published'], description: 'Blog status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Service ID' },
            title: { type: 'string', description: 'Service title' },
            description: { type: 'string', description: 'Service description' },
            featuredImage: { type: 'string', description: 'Featured image URL' },
            gallery: { type: 'array', items: { type: 'string' }, description: 'Gallery image URLs' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Supplier: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Supplier ID' },
            name: { type: 'string', description: 'Supplier name' },
            email: { type: 'string', format: 'email', description: 'Supplier email' },
            phone: { type: 'string', description: 'Supplier phone' },
            address: { type: 'string', description: 'Supplier address' },
            company: { type: 'string', description: 'Company name' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'], description: 'Supplier status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Quote: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Quote ID' },
            name: { type: 'string', description: 'Customer name' },
            email: { type: 'string', format: 'email', description: 'Customer email' },
            phone: { type: 'string', description: 'Customer phone' },
            message: { type: 'string', description: 'Quote message' },
            status: { type: 'string', enum: ['new', 'in-progress', 'completed', 'cancelled'], description: 'Quote status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            message: { type: 'string', description: 'Detailed error message' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Flavors',
        description: 'Flavor management endpoints',
      },
      {
        name: 'Sizes',
        description: 'Size management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category and subcategory management endpoints',
      },
      {
        name: 'Brands',
        description: 'Brand management endpoints',
      },
      {
        name: 'Services',
        description: 'Service management endpoints',
      },
      {
        name: 'Suppliers',
        description: 'Supplier management endpoints',
      },
      {
        name: 'Blogs',
        description: 'Blog management endpoints',
      },
      {
        name: 'Quotes',
        description: 'Quote and message management endpoints',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 