require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

console.log();

module.exports = {
  PORT,
  MONGODB_URI,
};
