export class Node {
    constructor(
      public id: string,
      public name: string,
      public type: string,
      public host: string,
      public location: string,
      public password: string,
      public lastSync: Date,

      public timeLastAlert: Date,
      public CPULastAlert: Date,
      public memoryLastAlert: Date,
      public networkLastAlert: Date,
      public loadLastAlert: Date,

      public timeLimit: number,
      public timeLimitAlert: number,

      public maxCPU: number,
      public maxMemory: number,
      public maxNetwork: number,
      public maxLoad: number,

      public minCPU: number,
      public minMemory: number,
      public minNetwork: number,
      public minLoad: number,

    ) {}
  }
  