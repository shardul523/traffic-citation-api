import { config } from "dotenv";

import app from "./app";

async function main() {
  config();

  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log("Server started at port", PORT);
  });

  process.on("beforeExit", () => server.close());

  var cleanExit = function () {
    process.exit();
  };
  process.on("SIGINT", cleanExit); // catch ctrl-c
  process.on("SIGTERM", cleanExit); // catch kill
}

main();
