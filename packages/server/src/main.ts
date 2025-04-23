import "../global.d.ts"

global.env = process.argv.join(" ").includes("PREVIEW")
  ? "preview"
  : process.argv.join(" ").includes("LOCAL")
    ? "local"
    : "prod"
// global.env = "prod";
Bun.env.BRANCH = process.argv.join(" ").includes("PREVIEW") ? "PREVIEW" : "PROD"
global.envUrl = "http://localhost:3000/"
switch (env) {
  case "local":
    global.envUrl = "http://localhost:3000/"
    global.frontendUrl = "http://localhost:5173/"
    break
  case "preview":
    global.envUrl = "https://preview-api.craftcityrp.pl/"
    global.frontendUrl = "https://preview.craftcityrp.pl/"
    break
  case "prod":
    global.envUrl = "https://api.craftcityrp.pl/"
    global.frontendUrl = "https://craftcityrp.pl/"
    break
}

require("./index")
