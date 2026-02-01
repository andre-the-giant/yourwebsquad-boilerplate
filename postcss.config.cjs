const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [autoprefixer(), ...(isProd ? [cssnano({ preset: "default" })] : [])]
};
