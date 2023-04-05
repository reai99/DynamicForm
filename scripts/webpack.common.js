module.exports = {
  resolve: {
    alias: {
      "~": "/src",
      "react-native": "react-native-web",
    },
    extensions: [".js", ".css", ".jsx", ".json", ".web.jsx", ".web.js", ".mjs"],
    // node核心模块加载
    fallback: {
      process: false,
    },
  },
};
