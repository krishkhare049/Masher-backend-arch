module.exports = {
  presets: ["babel-preset-expo"], // If using Expo
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["react-native-reanimated/plugin"],
  ],
};
