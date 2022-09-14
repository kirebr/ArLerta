import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from "typeorm"

@Entity({ name: "access_token" })
export default class AccessToken extends BaseEntity {
  @PrimaryGeneratedColumn("identity")
  id!: number

  @Column({ name: "user_id", type: "varchar", nullable: false })
  userId!: string

  @Column({ name: 'client_id', type: 'varchar', nullable: false})
  clientId!: string

  @Column({ type: "varchar", nullable: false, unique: true })
  token!: string

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Timestamp

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Timestamp
}