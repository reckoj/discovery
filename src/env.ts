export const APP_ENV = process.env.REACT_APP_ENV || 'DEV';

export const getEnv = () => {
  const env = APP_ENV.trim().toUpperCase();
  switch (env) {
    case 'DEV':
      return {
        // API_URL: 'http://localhost:8888',
        API_URL: 'https://discovery-backend.onrender.com',
        ENCRYPT_KEY: 'betHelle_crm',
        API_VERSION: '1.0',
      };
    case 'STAGING':
      return {
        API_URL: 'https://discovery-backend.onrender.com',
        // API_URL: 'http://localhost:8888',
        ENCRYPT_KEY: 'betHelle_crm',
        API_VERSION: '1.0',
      };
    case 'QA':
      return {};
    default:
      return {};
  }
};
