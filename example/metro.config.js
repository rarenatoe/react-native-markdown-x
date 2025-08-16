const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// Ensure Metro can resolve hoisted deps from the monorepo root (../node_modules)
const config = {
  watchFolders: [path.resolve(__dirname, '..')],
  resolver: {
    // Search in the app's node_modules and the monorepo root node_modules
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ],
    // Keep lookups constrained to the paths above to avoid duplicates
    disableHierarchicalLookup: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
