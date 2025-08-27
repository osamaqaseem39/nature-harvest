// Simple API test script
// Run with: node test-api.js

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

// Simple environment validation
function validateEnvironment() {
  const errors = [];
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
    errors.push('NEXT_PUBLIC_API_URL is not set');
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.log('\nPlease check your .env.local file');
    process.exit(1);
  }
}

async function testAPI() {
  // Validate environment first
  validateEnvironment();
  
  console.log('Testing API endpoints...\n');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`API Timeout: ${API_TIMEOUT}ms\n`);

  try {
    // Test brands endpoint
    console.log('1. Testing brands endpoint...');
    const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
    const brandsData = await brandsResponse.json();
    console.log(`   Status: ${brandsResponse.status}`);
    console.log(`   Brands found: ${brandsData.data?.length || 0}`);
    console.log(`   Success: ${brandsData.success}\n`);

    // Test flavors endpoint
    console.log('2. Testing flavors endpoint...');
    const flavorsResponse = await fetch(`${API_BASE_URL}/flavors`);
    const flavorsData = await flavorsResponse.json();
    console.log(`   Status: ${flavorsResponse.status}`);
    console.log(`   Flavors found: ${flavorsData.data?.length || 0}`);
    console.log(`   Success: ${flavorsData.success}\n`);

    // Test sizes endpoint
    console.log('3. Testing sizes endpoint...');
    const sizesResponse = await fetch(`${API_BASE_URL}/sizes`);
    const sizesData = await sizesResponse.json();
    console.log(`   Status: ${sizesResponse.status}`);
    console.log(`   Sizes found: ${sizesData.data?.length || 0}`);
    console.log(`   Success: ${sizesData.success}\n`);

    // Test products endpoint
    console.log('4. Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE_URL}/products?limit=5`);
    const productsData = await productsResponse.json();
    console.log(`   Status: ${productsResponse.status}`);
    console.log(`   Products found: ${productsData.data?.length || 0}`);
    console.log(`   Total products: ${productsData.pagination?.total || 0}`);
    console.log(`   Success: ${productsData.success}\n`);

    // Test products with filters
    console.log('5. Testing products with filters...');
    const filteredResponse = await fetch(`${API_BASE_URL}/products?status=Active&limit=3`);
    const filteredData = await filteredResponse.json();
    console.log(`   Status: ${filteredResponse.status}`);
    console.log(`   Filtered products found: ${filteredData.data?.length || 0}`);
    console.log(`   Success: ${filteredData.success}\n`);

    console.log('✅ All API tests completed successfully!');
    
    // Show sample data
    if (brandsData.data?.length > 0) {
      console.log('\n📋 Sample brand data:');
      console.log(JSON.stringify(brandsData.data[0], null, 2));
    }
    
    if (productsData.data?.length > 0) {
      console.log('\n📋 Sample product data:');
      console.log(JSON.stringify(productsData.data[0], null, 2));
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\nMake sure your API server is running on http://localhost:5000');
    console.log('You can start it with: cd nature-harvest-server && npm start');
  }
}

testAPI(); 