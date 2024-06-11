import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';

import { Nodes } from '../../nodes/models/nodes.model';

@Entity()
export class Datas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  host: string;

  @Column()
  online4: boolean;
  @Column()
  online6: boolean;

  @Column()
  uptime: string;
  @Column('decimal', { precision: 12, scale: 11 })
  load: number;

  @Column()
  network_rx: number;
  @Column()
  network_tx: number;

  @Column('decimal', { precision: 6, scale: 3 })
  cpu: number;

  @Column()
  memory_total: number;
  @Column()
  memory_used: number;
  @Column()
  swap_total: number;
  @Column()
  swap_used: number;
  @Column()
  hdd_total: number;
  @Column()
  hdd_used: number;
  @Column()
  custom: string;

  @CreateDateColumn()
  created_at: Date;
}
