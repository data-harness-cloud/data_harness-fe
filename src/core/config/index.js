const projectConfig = {
  // baseUrl: import.meta.env.VITE_DATA_HARNESS_EXTERNAL_API,
  baseUrl: window.location.origin + '/api',
  aiUrl: import.meta.env.VITE_DATA_HARNESS_OPENAI_URL,
  publicKey: import.meta.env.VITE_DATA_HARNESS_TOKEN,
  projectName: '驭数轻云数据平台',
}

export default projectConfig
