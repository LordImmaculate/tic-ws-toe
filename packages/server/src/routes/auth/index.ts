import { error, t } from "elysia"
import { UserInstance } from "../../db/user.controller"
import { createElysia } from "../../elysia"

export default createElysia().group("auth", (app) => {
  return app
    .post(
      "/refresh",
      async ({ body, db }) => {
        const user = await db.user.findUnique({ where: { id: body.b } })
        if (!user) return error(400, "Incorrect parameter b")
        const token = await new UserInstance(user).authorization().getAccessToken(body.a)
        if (!token) return error(400, "Bad request")
        return token
      },
      {
        /**
         * a - refreshToken
         * b - uuid
         */
        body: t.Object({
          a: t.String(),
          b: t.String(),
        }),
      }
    )
    .post(
      "/logout",
      async ({ body, db }) => {
        const user = await db.user.findFirst({ where: { refreshTokens: { some: { token: body } } } })
        if (!user) return error(400, "Wrong token")
        await new UserInstance(user).authorization().invalidateRfToken(body)
        return error(200, "Logged out")
      },
      {
        /**
         * body - rfToken
         */
        body: t.String(),
      }
    )
})
