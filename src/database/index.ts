import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "../models/User"
import LimitAmbiente from "../models/LimitAmbiente"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "kesavan.db.elephantsql.com",
    port: 5432,
    username: "ptjmxdyr",
    password: "SjUNpyKKFfOKsYS3iT5vDKEfAFwZygx-",
    database: "ptjmxdyr",
    entities: [User, LimitAmbiente],
    synchronize: true,
    logging: false,
})

export default AppDataSource;