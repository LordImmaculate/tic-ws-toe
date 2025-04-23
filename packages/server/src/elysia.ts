import Elysia, { ElysiaConfig } from "elysia"

import type { User } from "@prisma/client"
import { db } from "../db"

type Context = {
  user: User | null
  db: typeof db
  unauthorizedError: string | null
}

// Create the context handler function
const contextHandler = async ({ headers, ip }: { headers: Record<string, string>; ip: string }): Promise<Context> => {
  const auth = headers.authorization
  if (!auth) return { user: null, unauthorizedError: "No auth token provided", db: db }

  const accessToken = await db.accessToken.findUnique({
    where: {
      token: auth,
    },
    include: {
      user: true,
    },
  })
  if (!accessToken) return { user: null, unauthorizedError: "Invalid auth token", db: db }

  if (!accessToken) return { user: null, unauthorizedError: "Invalid auth token", db: db }
  if (accessToken.expiresAt.getTime() <= new Date().getTime())
    return { user: null, unauthorizedError: "Invalid auth token", db: db }

  return {
    user: accessToken.user,
    unauthorizedError: null,
    db: db,
  }
}

export const createContext = new Elysia()
  .derive(async ({ headers }) => {
    const auth = headers.authorization
    if (!auth) return { user: null, unauthorizedError: "No auth token provided", db: db }

    const accessToken = await db.accessToken.findUnique({
      where: {
        token: auth,
      },
      include: {
        user: true,
      },
    })
    if (!accessToken) return { user: null, unauthorizedError: "Invalid auth token", db: db }

    if (!accessToken) return { user: null, unauthorizedError: "Invalid auth token", db: db }
    if (accessToken.expiresAt.getTime() <= new Date().getTime())
      return { user: null, unauthorizedError: "Invalid auth token", db: db }

    return {
      user: accessToken.user,
      unauthorizedError: null,
      db: db,
    }
  })
  .as("plugin")

// Create the factory function with proper typing
export function createElysia<P extends string = "">(config?: ElysiaConfig<P>) {
  return new Elysia(config).use(createContext)
}
