import app from "./index";
import configEnv from "./src/configs/config.env";

let port = configEnv.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});
