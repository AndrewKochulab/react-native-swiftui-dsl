module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@tokens': './src/Tokens',
            '@constants': './src/Constants',
            '@logger': './src/Logger',
            '@screen-state': './src/ScreenState',
            '@utils': './src/Utils',
            '@binding': './src/Binding',
            '@gesture': './src/Gesture',
            '@animation': './src/Animation',
            '@config': './src/Config',
            '@theme': './src/Theme',
            '@responsive': './src/Responsive',
            '@core': './src/Core',
            '@primitives': './src/Primitives',
            '@conditionals': './src/Conditionals',
            '@navigation': './src/Navigation',
            '@tests': './__tests__',
          },
        },
      ],
    ],
  };
};
