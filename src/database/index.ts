import { createConnection, getConnection } from "typeorm"

export default class ConnectionDatabase {
  private static instance: ConnectionDatabase

  public static async getInstance(): Promise<ConnectionDatabase> {
    if (!ConnectionDatabase.instance) {
      ConnectionDatabase.instance = new ConnectionDatabase()
      await ConnectionDatabase.instance.create()

      console.log("Database connection created!")
    }

    return ConnectionDatabase.instance
  }

  async create() {
    await createConnection()
  }

  public async close() {
    console.log("Closing connection...")
    await getConnection().close()
  }
}