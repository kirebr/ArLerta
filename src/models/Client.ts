import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export default class Client extends BaseEntity {
  @PrimaryGeneratedColumn("identity")
  id!: number

  @Column({ type: "varchar", nullable: false, unique: true })
  name!: string

  @Column({ name: "client_id", type: "varchar", nullable: false, unique: true })
  clientId!: string

  @Column({ name: "client_secret", type: "varchar", nullable: false })
  clientSecret!: string

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Timestamp

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Timestamp
}