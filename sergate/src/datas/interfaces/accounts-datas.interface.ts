export interface Accountsdatas {
  readonly id: number;

  readonly host: string;
  
  readonly online4: boolean;
  readonly online6: boolean;
  
  readonly uptime: string;
  readonly load: number;
  
  readonly network_rx: number;
  readonly network_tx: number;
  
  readonly cpu: number;
  
  readonly memory_total: number;
  readonly memory_used: number;
  readonly swap_total: number;
  readonly swap_used: number;
  readonly hdd_total: number;
  readonly hdd_used: number;
  readonly custom: string;

  readonly created_at: Date;
}
