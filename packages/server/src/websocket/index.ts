import { User } from "@prisma/client"
import Elysia from "elysia"
import { db } from "../db"
type ElysiaWebSocket = Parameters<Parameters<typeof Elysia.prototype.ws>[1]["open"]>[0]

export interface WebsocketRoute {
  name: string
  callback: (
    ws: WSInstance<User>,
    message: any
  ) =>
    | Promise<void>
    | WebsocketMessage
    | Promise<WebsocketMessage>
    | WebsocketMessage[]
    | Promise<WebsocketMessage[]>
    | void
  children?: WebsocketRoute[]
}

class WSInstance<T> {
  public agent: T
  public interval?: Timer
  public ws: ElysiaWebSocket

  constructor(agent: T, ws: ElysiaWebSocket) {
    this.agent = agent
    this.ws = ws
  }
}

interface WebsocketMessage {
  type: string
  data: { [key: string]: string | { [key: string]: string } }
}

export function newWebsocket() {
  const connections = new Map<string, WSInstance<User>>()

  const callbackMap = {}
  const userUpdatedCallback: {
    [key: string]: () => {}
  } = {}

  const routes: WebsocketRoute[] = []

  const handle = new Elysia().ws("/", {
    //@ts-ignore
    async open(ws) {
      if (!ws.data.query["a"]) return ws.close()
      const [agent, token] = ws.data.query["a"]?.split("!")
      if (!agent || !token) return ws.close()
      if (!ws.data.headers["cf-connecting-ip"] && !["::ffff:127.0.0.1", "::1"].includes(ws.raw.remoteAddress))
        return ws.close()
      const ip = ["::ffff:127.0.0.1", "::1"].includes(ws.raw.remoteAddress)
        ? "local"
        : ws.data.headers["cf-connecting-ip"]
      if (!ip) return ws.close()
      if (agent === "u") {
        const user = await db.accessToken.findUnique({ where: { token }, include: { user: true } })
        if (!user) return ws.close()
        connections.set(ws.id, new WSInstance<User>(user.user, ws))
      }
      const wsI = connections.get(ws.id)
      if (wsI) {
        wsI.interval = setInterval(async () => {
          //@ts-ignore
          wsI.ws.send("p")
        }, 10000)
      }
    },
    async message(ws, _message) {
      if (_message === "p") return
      const message = _message as any

      const paths = message.type.split("/")
      let route: WebsocketRoute[] | WebsocketRoute = routes
      let index = 0
      const findRoute = () => {
        if (!(route instanceof Array)) return
        route.find((r) => {
          if (r.name === paths[index]) {
            if (r.name !== paths[paths.length - 1]) {
              //@ts-ignore
              route = r.children
              index++
              findRoute()
            } else {
              route = r
              return true
            }
          }
        })
      }

      findRoute()

      if (!route)
        return ws.send(
          JSON.stringify({
            type: "error",
            data: { message: "endpoint not found" },
          })
        )
      //@ts-ignore
      route = route as WebsocketRoute
      //@ts-ignore
      const response = await route.callback(connections.get(ws.id), message)
      if (response instanceof Array) {
        response.forEach((r) => ws.send(JSON.stringify(r)))
      } else if (response) {
        ws.send(JSON.stringify(response))
      }
    },
    async close(ws) {
      const connection = connections.get(ws.id)
      if (connection) {
        clearInterval(connection.interval)
        connections.delete(ws.id)
      }
    },
  })

  return {
    handle,
  }
}
