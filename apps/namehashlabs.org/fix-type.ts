import * as fs from "fs";
import * as path from "path";

function fixType() {
  try {
    // Resolve the path to the package.json of @calcom/embed-react
    const packageJsonPath = require.resolve("@calcom/embed-react/package.json");
    const packageJsonDir = path.dirname(packageJsonPath);

    // Read the package.json file
    const packageJsonRaw = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonRaw);

    // Modify the types path
    packageJson.exports["."].types = "./dist/embed-react/src/index.d.ts";

    // Write the modified package.json back
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(
      "Successfully fixed the type definitions for @calcom/embed-react"
    );
  } catch (error) {
    console.error("Error while fixing type definitions:", error);
  }
}

fixType();
