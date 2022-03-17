module.exports = ( phase, { defaultConfig }) => {
  return {
    env: {
      ONYXMD_PAGE_HISTORY_SIZE: '20',
      ONYXMD_REDIS_HOST: 'localhost',
      ONYXMD_REDIS_PORT: '6379',
      ONYXMD_REDIS_PASSWORD: '',
    },
    reactStrictMode: true,
  }
}
