import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "../models/User"
import LimitAmbiente from "../models/LimitAmbiente"
import NotificationHistory from "../models/NotificationHistory"
import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import Client from "../models/Client";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "kesavan.db.elephantsql.com",
    port: 5432,
    username: "ptjmxdyr",
    password: "SjUNpyKKFfOKsYS3iT5vDKEfAFwZygx-",
    database: "ptjmxdyr",
    entities: [User, LimitAmbiente, NotificationHistory, RefreshToken, Client, AccessToken],
    synchronize: true,
    logging: false,
})

export default AppDataSource;