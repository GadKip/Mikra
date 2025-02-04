const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Add proper source extensions
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'ttf']
  },
  // Add asset handling
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles']
  }
});

module.exports = withNativeWind(config, { input: './global.css' });
