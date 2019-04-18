import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
 } from "typeorm";
import { Deposit } from "./Deposit.entity";
import { Sales } from "./Sales.entity";

// export enum TransactionState {
//   ON = "On",
//   OFF = "Off",
//   PAUSE = "Pause",
// }

@Entity("Company")
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "datetime"})
  public createdAt: Date;

  @UpdateDateColumn({type: "datetime"})
  public updatedAt: Date;

  @OneToMany(type => Sales, sales => sales.company)
  public salesList: Sales[];

  @OneToMany(type => Deposit, deposit => deposit.company)
  public depositList: Deposit[];

  @Column({type: "varchar", length: 64, default: "" })
  public companyName: string;

  @Column({type: "varchar", length: 64, default: "ON" })
  public transactionState: string;

  @Column({type: "varchar", length: 64, default: ""})
  public accountNumber: string;

  @Column({type: "varchar", length: 32, default: ""})
  public phone: string;

  @Column({type: "varchar", length: 32, default: ""})
  public depositDate: string;

  @Column({type: "varchar", length: 128, default: ""})
  public memo: string;

}
