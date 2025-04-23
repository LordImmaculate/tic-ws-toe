import cuid2 from "@paralleldrive/cuid2"
import { createHash } from "crypto"

let hashing = {
  sha256: async (str: string): Promise<string> => {
    return createHash("sha256").update(str).digest("hex")
  },
  nameToken: (name: string): string => {
    return Buffer.from(name).toString("base64")
  },
  token: async (username: string, id: string | number): Promise<string> => {
    let firstPart = await hashing.sha256(username + id)
    let base64datafirstpart = Buffer.from(firstPart).toString("base64")
    let firstPart1 = new Date().getTime() + base64datafirstpart
    firstPart = Buffer.from(firstPart1.toString()).toString("base64")
    let secondPartLength = Math.floor(Math.random() * 10) + 20
    let secondPart = await hashing.sha256(username + new Date().getTime() + id)
    secondPart = secondPart.substring(0, secondPartLength)
    return firstPart + "." + secondPart
  },
}

export default hashing
