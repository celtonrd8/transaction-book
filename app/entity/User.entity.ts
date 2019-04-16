import {PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 128, default: '' })
  public sensorName: string;

  @Column({type: 'varchar', length: 128, default: '' })
  public sensorKey: string;

  @Column({type: 'varchar', length: 128, default: ''})
  public sensorUnit: string;

  @Column({type: 'int', default: 0})
  public miniumValue: number;

  @Column({type: 'int', default: 0})
  public maxiumValue: number;

  @Column({type: 'int', default: 0})
  public decimalPoint: number;

  @Column({type: 'boolean', default: true})
  public isSelect: boolean;
}
