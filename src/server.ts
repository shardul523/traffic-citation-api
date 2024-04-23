import { config } from "dotenv";

import app from "./app";

async function main() {
  config();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server started at port", PORT);
  });
}

main();
