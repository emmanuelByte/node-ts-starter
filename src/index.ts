import app from "./app";
import config from "./config/config";
import color from "colors";
const port = config.app.port;

app.listen(port, () => {
  console.log(`Server running on port ${port}`.green);
});
