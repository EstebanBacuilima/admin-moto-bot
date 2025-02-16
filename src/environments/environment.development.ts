export const environmentUrl = (dev: boolean) => `http://${dev ? '134.122.114.162:5000' : 'localhost:5295'}/api/v1`;

export const environment = {
  production: false,
  API_URL: environmentUrl(true),
};
