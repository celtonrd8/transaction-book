import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
 } from "typeorm";

 import { Company } from "./Company.entity";

@Entity("Sales")
export class Sales {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "datetime"})
  public createdAt: Date;

  @UpdateDateColumn({type: "datetime"})
  public updatedAt: Date;

  @ManyToOne(type => Company, company => company.salesList, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public company: Company;

  @Column({type: 'int', default: 0})
  public year: number;

  @Column({type: 'int', default: 0})
  public month: number;

  @Column({type: 'int', default: 0})
  public day: number;

  @Column({type: 'int', default: 0})
  public supplyAmount: number;

  @Column({type: 'int', default: 0})
  public taxAmount: number;

  @Column({type: 'int', default: 0})
  public totalAmount: number;

}
