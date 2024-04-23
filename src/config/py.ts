import { interpreter as py } from "node-calls-python";
import path from "path";

py.addImportPath(
  path.join(
    __dirname,
    "..",
    "..",
    "..",
    "ai-model",
    "venv/lib/python3.10/site-packages"
  )
);

export const pyModule = py.importSync(
  path.join(__dirname, "..", "..", "..", "ai-model", "main.py"),
  true
);

export { py };
