import * as crypto from 'crypto';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

const SECRET = "temperatura_secret"

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("identity")
  id!: number

  @Column({ type: "varchar", nullable: false })
  name!: string

  @Column({ type: "varchar", nullable: false, unique: true })
  email!: string

  @Column({ type: "varchar", nullable: false })
  password!: string

  @Column({ type: "varchar", nullable: false })
  type!: UserTypeEnum

  @Column({ type: "varchar", nullable: true })
  status!: UserStatusEnum

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date

  encryptPassword(password: string) {
    this.password = this.encryptAsSha1(password)
  }

  encryptAsSha1(password: string): string {
    return crypto.createHmac("sha1", SECRET).update(password).digest("hex")
  }

  encryptRandomPassword() {
    this.password = crypto.randomBytes(20).toString("hex")
  }

  public checkPassword(password: string): boolean {
    return this.encryptAsSha1(password) === this.password
  }
}

export enum UserTypeEnum {
  NURSE = "NURSE",
  NURSE_CHIEF = "NURSE_CHIEF",
}

export enum UserStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}