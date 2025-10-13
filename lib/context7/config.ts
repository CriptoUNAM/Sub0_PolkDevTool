export const CONTEXT7_CONFIG = {
  apiKey: process.env.CONTEXT7_API_KEY || '',
  baseUrl: 'https://api.context7.ai',
  timeout: 30000,
  retries: 3,
  defaultTokens: 1000,
};

export const CONTEXT7_ENDPOINTS = {
  search: '/v1/search',
  docs: '/v1/docs',
  generate: '/v1/generate',
};

export const CONTEXT7_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${CONTEXT7_CONFIG.apiKey}`,
};
