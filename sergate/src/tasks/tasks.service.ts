import { NodesService } from '@/nodes/nodes.service';
import { NODES_REPOSITORY_TOKEN } from '@/nodes/repositories/nodes.repository.interface';
import { SmsService } from '@/shared/sms/sms.service';
import { UsersService } from '@/users/users.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    constructor(
        @Inject(NODES_REPOSITORY_TOKEN)
        private readonly nodesService: NodesService,
        private readonly usersService: UsersService,
        private readonly smsService: SmsService,
    ) {
        Logger.log('TasksService initialized');
    }

    @Cron('10 * * * * *')
    async healthCheck() {
        const nodes = await this.nodesService.findAll();
        nodes.forEach(async node => {
            if (node.lastSync) {
                const date = new Date();
                if (date.getTime() - node.timeLimit * 1000 > node.lastSync.getTime()) {
                    Logger.error(`Node ${node.host} is not synced`);
                    if (node.lastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.lastAlert.getTime()) {
                        try {
                            const user = (await this.usersService.findAdmin()).map(user => user.phone);
                            Logger.log(`Alert sent to ${user}`);
                            await this.smsService.sendSms(user, `Node ${node.host} is not synced`);
                            node.lastAlert = date;
                            await this.nodesService.updateNode(node.id, node);
                        } catch (error) {
                            Logger.error(`Alert can not sent to ${node.host}: ${error}`);
                        }
                    } else {
                        Logger.error(`Alert already sent to ${node.host}`);
                    }
                }
            }
        });
    }
}