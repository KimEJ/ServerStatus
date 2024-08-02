export interface AccountsNodes {
  readonly id: number;
  readonly name: string;
  readonly type: string;
  readonly host: string;
  readonly location: string;
  readonly password: string;
  readonly lastSync: Date;
  readonly timeLastAlert: Date;
  readonly CPULastAlert: Date;
  readonly memoryLastAlert: Date;
  readonly networkLastAlert: Date;
  readonly loadLastAlert: Date;
  readonly timeLimit: number;
  readonly timeLimitAlert: number;
  readonly maxCPU: number;
  readonly maxMemory: number;
  readonly maxNetwork: number;
  readonly maxLoad: number;
  readonly minCPU: number;
  readonly minMemory: number;
  readonly minNetwork: number;
  readonly minLoad: number;
  
}
