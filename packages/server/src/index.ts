import { cors } from "@elysiajs/cors";
import { treaty } from "@elysiajs/eden";
import { error, t } from "elysia";

import { createElysia } from "./elysia";
import routes from "./routes";
import { newWebsocket } from "./websocket";

const app = createElysia()
  .use(cors())
  .get("/", () => {
    return {
      name: "Elysia API App"
    };
  })
  .get("/test", () => "Hello world from Elysia backend!")
  .use(routes);

global.websocket = newWebsocket();
app.listen(3000);
console.log("Server started");

export type websocket = ReturnType<typeof newWebsocket>["handle"];
export type App = typeof app;
