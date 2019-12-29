import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
 } from 'typeorm';
import { Company } from './Company.entity';

@Entity('Deposit')
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: 'datetime'})
  public createdAt: Date;

  @UpdateDateColumn({type: 'datetime'})
  public updatedAt: Date;

  @ManyToOne(type => Company, company => company.depositList, {
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

  @Column({type: 'int', default: ''})
  public originYear: number;

  @Column({type: 'int', default: ''})
  public originMonth: number;

  @Column({type: 'int', default: 0})
  public depositAmount: number;

  // @Column({type: 'int', default: 0})
  // public balanceAmount: number;
}
