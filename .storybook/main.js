const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: ["@storybook/addon-postcss"],
  webpackFinal: async (config) => {
    config.module.rules
      .filter(x => x.use?.[0]?.loader?.includes('babel-loader') ?? false)
      .forEach(babelLoaderSettings => {
        babelLoaderSettings.use[0].options.plugins
          .filter(val => val[1].loose === true)
          .forEach(val => {
            val[1].loose = false;
          });
      });
    config.module.rules.push({
      test: /\.scss$/,
      use: [{
        loader: "style-loader",
        options: {} // All options are optional but "options" isn't :(
      }, "css-loader", {
        loader: "sass-loader",
        options: {} // All options are optional but "options" isn't :(
      }],
      include: path.resolve(__dirname, "../")
    });
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]]
      }
    });
    config.resolve.extensions.push(".ts", ".tsx");
    config.performance = false;
    return config;
  }
};
