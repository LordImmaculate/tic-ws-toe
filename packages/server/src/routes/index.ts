import Elysia from "elysia"

import { createContext } from "../elysia"
import dashboard from "./dashboard"
import auth from "./auth"

export default new Elysia().use(createContext).use(dashboard).use(auth)
