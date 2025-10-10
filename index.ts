import app from "./src/app";
import { config } from "./src/config/env";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
