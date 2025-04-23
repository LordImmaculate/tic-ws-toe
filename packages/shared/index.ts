export type * from "@prisma/client"

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.BASE_URL || ""
  }
  return 'http://localhost:3000'
}

export { getBaseUrl }
