module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/models': './src/models',
            '@/store': './src/store',
            '@/utils': './src/utils',
            '@/theme': './src/theme',
            '@/navigation': './src/navigation',
            '@/i18n': './src/i18n',
            '@/config': './src/config'
          }
        }
      ]
    ]
  };
};