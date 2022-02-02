const morgan = require("morgan");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function (app) {
  winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/app" })
  );
  //   process.on("uncaughtException", (ex) => {
  //     winston.log("error", ex.mesage, { metadata: ex });
  //     process.exit(1);
  //   });

  //   process.on("unhandledRejection", (ex) => {
  //     winston.log("error", ex.mesage, { metadata: ex });
  //     process.exit(1);
  //   });
  app.use(morgan("tiny"));
};
