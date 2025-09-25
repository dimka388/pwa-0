// Environment-specific configuration
export interface EnvironmentConfig {
  API_BASE_URL: string;
  FORM_SUBMISSION_URL: string;
  TIMEOUT: number;
  DEBUG: boolean;
}

// Development environment
const developmentConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://localhost:3000/api',
  FORM_SUBMISSION_URL: 'https://script.google.com/macros/s/AKfycbzxHTC5EDzPrp0qPDvtnz-jPS4rcFfBW6hRz0TL10CiCnzFxJEKQbSbeOxe_UJFTnxP/exec',
  TIMEOUT: 10000,
  DEBUG: true,
};

// Production environment
const productionConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://your-production-api.com/api',
  FORM_SUBMISSION_URL: 'https://script.google.com/macros/s/AKfycbzxHTC5EDzPrp0qPDvtnz-jPS4rcFfBW6hRz0TL10CiCnzFxJEKQbSbeOxe_UJFTnxP/exec',
  TIMEOUT: 8000,
  DEBUG: false,
};

// Determine current environment (you can also use import.meta.env.MODE)
const isDevelopment = import.meta.env?.DEV ?? true;

// Export the appropriate configuration
export const ENV_CONFIG: EnvironmentConfig = isDevelopment ? developmentConfig : productionConfig;

// Legacy exports for backward compatibility
export const API_CONFIG = {
  FORM_SUBMISSION_URL: ENV_CONFIG.FORM_SUBMISSION_URL,
};

export const APP_CONFIG = {
  APP_NAME: 'PWA Share Point',
  VERSION: '0.0.1',
  TIMEOUT: ENV_CONFIG.TIMEOUT,
};

export const HTTP_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  TIMEOUT: ENV_CONFIG.TIMEOUT,
};