import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Datas } from '../../datas/models/datas.model';

@Entity()
export class Nodes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({
    unique: true,
  })
  host: string;

  @Column()
  location: string;

  @Column({ length: 60 })
  password: string;

  @Column({ type: 'timestamp', nullable: true})
  lastSync: Date;

  @Column({ type: 'timestamp', nullable: true})
  timeLastAlert: Date;

  @Column({ type: 'timestamp', nullable: true})
  CPULastAlert: Date;

  @Column({ type: 'timestamp', nullable: true})
  memoryLastAlert: Date;

  @Column({ type: 'timestamp', nullable: true})
  networkLastAlert: Date;

  @Column({ type: 'timestamp', nullable: true})
  loadLastAlert: Date;

  @Column({ default: 5 })
  timeLimit: number;

  @Column({ default: 86400 })
  timeLimitAlert: number;

  @Column('decimal', { precision: 6, scale: 3, nullable: true})
  maxCPU: number;

  @Column({nullable: true})
  maxMemory: number;

  @Column({nullable: true})
  maxNetwork: number;

  @Column('decimal', { precision: 12, scale: 11, nullable: true})
  maxLoad: number;

  @Column('decimal', { precision: 6, scale: 3, nullable: true})
  minCPU: number;

  @Column({nullable: true})
  minMemory: number;

  @Column({nullable: true})
  minNetwork: number;

  @Column('decimal', { precision: 12, scale: 11, nullable: true})
  minLoad: number;
}
