import { db } from "./index"
import { type User } from "@prisma/client"

export class UserInstance {
  public data: User

  constructor(data: User) {
    this.data = data
  }

  async save() {
    await db.user.update({
      where: { id: this.data.id },
      data: {
        ...this.data,
      },
    })
  }

  getNonSensitiveData() {
    return {
      createdAt: this.data.createdAt,
      ranks: this.data.ranks,
      preferredLanguage: this.data.preferredLanguage,
      id: this.data.id,
    }
  }

  moderation() {
    return {
      ban() {},
      tempban() {},
      ipban() {},
    }
  }

  authorization() {
    const u = this
    return {
      generateRefreshToken() {
        return auth.generateRefreshToken(u.data)
      },
      getAccessToken(rfToken: string) {
        return auth.getAccessToken(u.data, rfToken)
      },
      async invalidateRfToken(rfToken: string) {
        const token = await db.refreshToken.findUnique({
          where: {
            token: rfToken,
          },
        })
        if (!token) return
        if (token.userId !== u.data.id) return
        await db.refreshToken.delete({
          where: {
            id: token.id,
          },
        })
      },
    }
  }
}
