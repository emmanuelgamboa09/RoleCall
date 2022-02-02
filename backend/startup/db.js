const mongoose = require("mongoose");

module.exports = function () {
  mongoose.connect("mongodb://localhost/app").then(() => {
    console.log("Connected to MongoDB...");
  });
};
