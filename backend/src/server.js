const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file in the backend root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
