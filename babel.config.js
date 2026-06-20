module.exports = function (api) {
  api.cache(true);
  return {
    presets: [require.resolve('babel-preset-expo')],
    // Do not add reanimated/worklets plugins here — babel-preset-expo adds
    // react-native-worklets/plugin automatically when that package is installed.
  };
};
