#!/usr/bin/env node

/**
 * Nature Harvest Environment Validation Script
 * Validates that all environment files are properly configured
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}`);
  log('='.repeat(message.length));
}

// Validation rules for each project
const validationRules = {
  server: {
    required: ['MONGODB_URI', 'JWT_SECRET'],
    optional: ['PORT', 'NODE_ENV', 'ALLOWED_ORIGINS'],
    file: '.env',
    project: 'nature-harvest-server'
  },
  dashboard: {
    required: ['REACT_APP_API_URL'],
    optional: ['REACT_APP_DEBUG_MODE', 'REACT_APP_THEME'],
    file: '.env',
    project: 'nature-harvest-dashboard'
  },
  website: {
    required: ['NEXT_PUBLIC_API_URL'],
    optional: ['NEXT_PUBLIC_SITE_NAME', 'NEXT_PUBLIC_CONTACT_EMAIL'],
    file: '.env.local',
    project: 'nature-harvest-website'
  }
};

function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};

    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return env;
  } catch (error) {
    return null;
  }
}

function validateProject(projectName, rules) {
  const envPath = path.join(rules.project, rules.file);
  const env = loadEnvFile(envPath);

  logHeader(`Validating ${projectName} (${rules.file})`);

  if (!env) {
    logError(`Environment file not found: ${envPath}`);
    return { valid: false, missing: rules.required, warnings: [] };
  }

  const missing = [];
  const warnings = [];

  // Check required variables
  rules.required.forEach(key => {
    if (!env[key] || env[key].trim() === '') {
      missing.push(key);
    }
  });

  // Check for default/placeholder values
  Object.entries(env).forEach(([key, value]) => {
    if (value.includes('your-') || value.includes('placeholder') || value.includes('example')) {
      warnings.push(`${key}: Contains placeholder value`);
    }
  });

  // Check for common issues
  if (env.MONGODB_URI && env.MONGODB_URI.includes('localhost') && env.NODE_ENV === 'production') {
    warnings.push('MONGODB_URI: Using localhost in production environment');
  }

  if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET: Secret is shorter than recommended 32 characters');
  }

  if (env.REACT_APP_API_URL && env.REACT_APP_API_URL.includes('localhost') && env.NODE_ENV === 'production') {
    warnings.push('REACT_APP_API_URL: Using localhost in production environment');
  }

  if (env.NEXT_PUBLIC_API_URL && env.NEXT_PUBLIC_API_URL.includes('localhost') && env.NODE_ENV === 'production') {
    warnings.push('NEXT_PUBLIC_API_URL: Using localhost in production environment');
  }

  const valid = missing.length === 0;

  if (valid) {
    logSuccess(`All required variables are set`);
  } else {
    logError(`Missing required variables: ${missing.join(', ')}`);
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => logWarning(warning));
  }

  return { valid, missing, warnings };
}

function validateConnections() {
  logHeader('Testing API Connections');

  // This would require actual network requests
  // For now, just check if URLs are valid
  logInfo('Connection testing requires running servers');
  logInfo('Run this after starting your applications');
}

function generateReport(results) {
  logHeader('Environment Validation Report');

  let totalValid = 0;
  let totalMissing = 0;
  let totalWarnings = 0;

  Object.entries(results).forEach(([project, result]) => {
    if (result.valid) {
      totalValid++;
      logSuccess(`${project}: Valid`);
    } else {
      logError(`${project}: Invalid (${result.missing.length} missing variables)`);
    }

    totalMissing += result.missing.length;
    totalWarnings += result.warnings.length;
  });

  logHeader('Summary');
  logInfo(`Projects Valid: ${totalValid}/${Object.keys(results).length}`);
  logInfo(`Total Missing Variables: ${totalMissing}`);
  logInfo(`Total Warnings: ${totalWarnings}`);

  if (totalValid === Object.keys(results).length) {
    logSuccess('All projects are properly configured!');
  } else {
    logError('Some projects need configuration');
  }

  return totalValid === Object.keys(results).length;
}

function main() {
  logHeader('Nature Harvest Environment Validation');
  logInfo('Checking environment configuration for all projects...\n');

  const results = {};

  // Validate each project
  Object.entries(validationRules).forEach(([projectName, rules]) => {
    results[projectName] = validateProject(projectName, rules);
  });

  // Generate report
  const allValid = generateReport(results);

  // Provide next steps
  logHeader('Next Steps');
  
  if (allValid) {
    logSuccess('Environment setup is complete!');
    logInfo('You can now start your applications:');
    logInfo('1. Start MongoDB');
    logInfo('2. Start Server: cd nature-harvest-server && npm start');
    logInfo('3. Start Dashboard: cd nature-harvest-dashboard && npm start');
    logInfo('4. Start Website: cd nature-harvest-website && npm run dev');
  } else {
    logError('Please fix the issues above before starting applications');
    logInfo('Use the setup scripts to configure environment files:');
    logInfo('• Linux/Mac: ./setup-env.sh');
    logInfo('• Windows: setup-env.bat');
  }

  logInfo('\nFor detailed setup instructions, see: ENVIRONMENT_SETUP_GUIDE.md');

  // Exit with appropriate code
  process.exit(allValid ? 0 : 1);
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = {
  validateProject,
  loadEnvFile,
  validationRules
}; 