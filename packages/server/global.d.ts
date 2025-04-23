import AuthorizationModule from "./src/modules/authorization"
import { newWebsocket } from "./src/websocket"

export {}

declare global {
  var env: "preview" | "local" | "prod"
  var envUrl: string
  var frontendUrl: string
  let websocket: ReturnType<typeof newWebsocket>
}
