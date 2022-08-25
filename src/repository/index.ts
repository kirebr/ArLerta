import { EntityTarget, Entity } from "typeorm"
import AppDataSource from "../database"

export default (entity: EntityTarget<typeof Entity>) => {
  return AppDataSource.getRepository(entity);
}