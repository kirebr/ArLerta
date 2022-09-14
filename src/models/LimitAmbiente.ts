import { BaseEntity, OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import NotificationHistory from './NotificationHistory';
interface ILimitAmbiente {
  "id": number;
  "idFromAirPure": number;
  "co2": number;
  "umidade": number;
  "temperatura": number;
  "tvoc": number;
  "dbo": number;
  "lux": number;
}

export {
  ILimitAmbiente
}

@Entity()
export default class LimitAmbiente extends BaseEntity {
  @PrimaryGeneratedColumn("identity")
  id!: number

  @Column({ type: "varchar", nullable: false})
  idFromAirPure!: number

  @Column({ type: "decimal", nullable: false })
  co2!: number

  @Column({ type: "decimal", nullable: false })
  umidade!: number

  @Column({ type: "decimal", nullable: false })
  temperatura!: number

  @Column({ type: "decimal", nullable: false })
  tvoc!: number

  @Column({ type: "decimal", nullable: false })
  dbo!: number

  @Column({ type: "decimal", nullable: false })
  lux!: number

  @OneToMany(() => NotificationHistory, (notificationHistory) => notificationHistory.limit)
  notificationHistory: NotificationHistory[]
}