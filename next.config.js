module.exports = ( phase, { defaultConfig }) => {
  return {
    env: {
      ONYXMD_PAGE_HISTORY_SIZE: '20',
    },
    reactStrictMode: true,
  }
}
