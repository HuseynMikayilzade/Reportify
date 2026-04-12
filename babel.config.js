module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@domain': './src/domain',
            '@data': './src/data',
            '@presentation': './src/presentation',
            '@store': './src/store',
            '@infrastructure': './src/infrastructure',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@core': './src/core',
          },
        },
      ],
      'babel-plugin-transform-import-meta',
    ],
  };
};
