require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 7000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});