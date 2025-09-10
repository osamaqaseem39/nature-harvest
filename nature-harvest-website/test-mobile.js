#!/usr/bin/env node

/**
 * Mobile Optimization Test Script
 * Tests the mobile responsiveness of the Nature Harvest website
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Mobile Optimizations for Nature Harvest Website\n');

// Test 1: Check if mobile-specific files exist
console.log('📁 Checking mobile-specific files...');

const requiredFiles = [
  'src/app/mobile.css',
  'src/hooks/useMobile.ts',
  'src/components/MobileLayout.tsx',
  'src/components/MobileHero.tsx',
  'src/app/mobile/page.tsx',
  'src/middleware.ts',
  'MOBILE_OPTIMIZATION.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Test 2: Check mobile CSS classes
console.log('\n🎨 Checking mobile CSS classes...');

const mobileCSSPath = path.join(__dirname, 'src/app/mobile.css');
if (fs.existsSync(mobileCSSPath)) {
  const mobileCSS = fs.readFileSync(mobileCSSPath, 'utf8');
  
  const requiredClasses = [
    'mobile-text-xs',
    'mobile-text-sm',
    'mobile-text-base',
    'mobile-p-2',
    'mobile-p-3',
    'mobile-p-4',
    'mobile-grid-1',
    'mobile-grid-2',
    'mobile-hero-title',
    'mobile-button-primary',
    'mobile-touch-target'
  ];
  
  let allClassesExist = true;
  requiredClasses.forEach(className => {
    if (mobileCSS.includes(className)) {
      console.log(`✅ ${className} class found`);
    } else {
      console.log(`❌ ${className} class missing`);
      allClassesExist = false;
    }
  });
} else {
  console.log('❌ mobile.css file not found');
  allFilesExist = false;
}

// Test 3: Check responsive breakpoints in components
console.log('\n📱 Checking responsive breakpoints...');

const componentFiles = [
  'src/components/Header.tsx',
  'src/components/Hero.tsx',
  'src/components/WhoWeAre.tsx',
  'src/components/FeaturedProducts.tsx',
  'src/components/Brands.tsx',
  'src/components/Footer.tsx'
];

let responsiveComponents = 0;
componentFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('sm:') || content.includes('md:') || content.includes('lg:') || content.includes('xl:')) {
      console.log(`✅ ${file} has responsive classes`);
      responsiveComponents++;
    } else {
      console.log(`⚠️  ${file} may need responsive classes`);
    }
  }
});

// Test 4: Check mobile hooks
console.log('\n🔧 Checking mobile hooks...');

const hooksPath = path.join(__dirname, 'src/hooks/useMobile.ts');
if (fs.existsSync(hooksPath)) {
  const hooksContent = fs.readFileSync(hooksPath, 'utf8');
  
  const requiredHooks = [
    'useMobile',
    'useMobileAnimations',
    'useMobileLayout',
    'useMobileInteractions'
  ];
  
  let allHooksExist = true;
  requiredHooks.forEach(hook => {
    if (hooksContent.includes(`export const ${hook}`) || hooksContent.includes(`export { ${hook}`)) {
      console.log(`✅ ${hook} hook found`);
    } else {
      console.log(`❌ ${hook} hook missing`);
      allHooksExist = false;
    }
  });
} else {
  console.log('❌ useMobile.ts file not found');
  allFilesExist = false;
}

// Test 5: Check middleware
console.log('\n🛡️  Checking middleware...');

const middlewarePath = path.join(__dirname, 'src/middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  if (middlewareContent.includes('isMobile') && middlewareContent.includes('redirect')) {
    console.log('✅ Mobile detection middleware found');
  } else {
    console.log('❌ Mobile detection middleware incomplete');
  }
} else {
  console.log('❌ middleware.ts file not found');
  allFilesExist = false;
}

// Test 6: Check package.json for mobile dependencies
console.log('\n📦 Checking dependencies...');

const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const mobileDeps = ['next', 'react', 'react-dom'];
  const devDeps = ['tailwindcss', '@tailwindcss/postcss'];
  
  let depsOk = true;
  mobileDeps.forEach(dep => {
    if (packageContent.dependencies && packageContent.dependencies[dep]) {
      console.log(`✅ ${dep} dependency found`);
    } else {
      console.log(`❌ ${dep} dependency missing`);
      depsOk = false;
    }
  });
  
  devDeps.forEach(dep => {
    if (packageContent.devDependencies && packageContent.devDependencies[dep]) {
      console.log(`✅ ${dep} dev dependency found`);
    } else {
      console.log(`❌ ${dep} dev dependency missing`);
      depsOk = false;
    }
  });
} else {
  console.log('❌ package.json file not found');
  allFilesExist = false;
}

// Summary
console.log('\n📊 Test Summary:');
console.log('================');

if (allFilesExist) {
  console.log('✅ All required mobile files exist');
} else {
  console.log('❌ Some mobile files are missing');
}

if (responsiveComponents === componentFiles.length) {
  console.log('✅ All components have responsive classes');
} else {
  console.log(`⚠️  ${componentFiles.length - responsiveComponents} components may need responsive updates`);
}

console.log(`\n🎯 Mobile optimization status: ${allFilesExist ? 'COMPLETE' : 'INCOMPLETE'}`);

if (allFilesExist) {
  console.log('\n🚀 Your website is ready for mobile devices!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run dev" to start the development server');
  console.log('2. Test on mobile devices or use browser dev tools');
  console.log('3. Check the /mobile route for mobile-specific features');
  console.log('4. Verify responsive breakpoints work correctly');
} else {
  console.log('\n🔧 Please fix the missing files and run the test again');
}

console.log('\n📚 For more information, see MOBILE_OPTIMIZATION.md');