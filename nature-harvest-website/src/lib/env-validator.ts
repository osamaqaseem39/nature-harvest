// Environment validation utility
import { config } from './config';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required variables
  if (!process.env.NEXT_PUBLIC_API_URL) {
    errors.push('NEXT_PUBLIC_API_URL is required');
  }

  // Validate API URL format
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_API_URL);
    } catch {
      errors.push('NEXT_PUBLIC_API_URL must be a valid URL');
    }
  }

  // Validate numeric values
  const numericVars = [
    { name: 'NEXT_PUBLIC_API_TIMEOUT', value: process.env.NEXT_PUBLIC_API_TIMEOUT },
    { name: 'NEXT_PUBLIC_API_RETRY_ATTEMPTS', value: process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS },
    { name: 'NEXT_PUBLIC_PRODUCTS_PER_PAGE', value: process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE },
    { name: 'NEXT_PUBLIC_FEATURED_PRODUCTS_LIMIT', value: process.env.NEXT_PUBLIC_FEATURED_PRODUCTS_LIMIT },
    { name: 'NEXT_PUBLIC_DEMO_PRODUCTS_LIMIT', value: process.env.NEXT_PUBLIC_DEMO_PRODUCTS_LIMIT },
    { name: 'NEXT_PUBLIC_IMAGE_QUALITY', value: process.env.NEXT_PUBLIC_IMAGE_QUALITY },
  ];

  numericVars.forEach(({ name, value }) => {
    if (value && isNaN(Number(value))) {
      errors.push(`${name} must be a valid number`);
    }
  });

  // Validate image quality range
  const imageQuality = parseInt(process.env.NEXT_PUBLIC_IMAGE_QUALITY || '85');
  if (imageQuality < 1 || imageQuality > 100) {
    errors.push('NEXT_PUBLIC_IMAGE_QUALITY must be between 1 and 100');
  }

  // Warnings for development
  if (config.isDevelopment) {
    if (process.env.NEXT_PUBLIC_API_URL?.includes('localhost')) {
      warnings.push('Using localhost API URL - make sure your API server is running');
    }
    
    if (config.development.debugMode) {
      warnings.push('Debug mode is enabled - this may affect performance');
    }
  }

  // Production warnings
  if (config.isProduction) {
    if (process.env.NEXT_PUBLIC_API_URL?.includes('localhost')) {
      errors.push('Cannot use localhost API URL in production');
    }
    
    if (config.development.debugMode) {
      warnings.push('Debug mode should be disabled in production');
    }
    
    if (config.development.showApiErrors) {
      warnings.push('API errors are visible in production - consider disabling for security');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Function to log validation results
export function logEnvironmentValidation(): void {
  const result = validateEnvironment();
  
  console.log('🔍 Environment Validation Results:');
  console.log('=====================================');
  
  if (result.isValid) {
    console.log('✅ Environment configuration is valid');
  } else {
    console.log('❌ Environment configuration has errors:');
    result.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  console.log('=====================================');
}

// Function to throw error if environment is invalid
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();
  
  if (!result.isValid) {
    throw new Error(`Environment validation failed:\n${result.errors.join('\n')}`);
  }
} 