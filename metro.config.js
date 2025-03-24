/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Apply NativeWind configuration first
const configWithNativeWind = withNativeWind(config, { input: './global.css' });

// Then wrap with Reanimated's Metro config
module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind);
