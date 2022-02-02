const cors = require("cors");
const helmet = require("helmet");

module.exports = function (app) {
  app.use(cors());
  app.use(helmet());
};
