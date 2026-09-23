import { DEFAULT_PORTS } from "./constants.js";
import { app } from "./app.js";

const port = process.env.PORT || DEFAULT_PORTS;

app.listen(port, (error?: Error) => {
  if (error) {
    console.error(`Failed to start server on port ${port}`);
    console.error(error.message);
    process.exit(1);
  }

  console.log(`Server is running on port ${port}`);
});
