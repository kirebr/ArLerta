import { BaseEntity, CreateDateColumn, Column, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import LimitAmbiente, { ILimitAmbiente } from './LimitAmbiente';

interface INotificationHistory {
  "id": number;
  "type": DeviceEnum;
  "deviceValue": number,
  "createdAt": Date,
  "limit": [ILimitAmbiente],
}

export {
  INotificationHistory
}

@Entity()
export default class NotificationHistory extends BaseEntity {
  @PrimaryGeneratedColumn("identity")
  id!: number

  @Column({ type: "varchar", nullable: false })
  type!: DeviceEnum

  @Column({ type: "decimal", nullable: false, name: "device_value" })
  deviceValue!: number

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @ManyToOne(() => LimitAmbiente, (limit) => limit.notificationHistory)
  limit: LimitAmbiente
}

export enum DeviceEnum {
  co2 = "co2",
  umidade = "umidade",
  temperatura = "temperatura",
  tvoc = "tvoc",
  dbo = "dbo",
  lux = "lux"
}