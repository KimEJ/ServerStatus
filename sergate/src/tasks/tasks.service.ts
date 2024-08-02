import { Nodes } from '@/nodes/models/nodes.model';
import { NodesService } from '@/nodes/nodes.service';
import { NODES_REPOSITORY_TOKEN } from '@/nodes/repositories/nodes.repository.interface';
import { SmsService } from '@/shared/sms/sms.service';
import { UsersService } from '@/users/users.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

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

    @Cron(CronExpression.EVERY_MINUTE)
    async healthCheck() {
        const nodes = await this.nodesService.findAll();
        nodes.forEach(async node => {
            if (node.lastSync) {
                const date = new Date();
                if (date.getTime() - node.timeLimit * 1000 > node.lastSync.getTime()) {
                    Logger.error(`Node ${node.host} is not synced: ${node.lastSync.toISOString()} ${date.toISOString()}`);
                    Logger.debug(`- ${node.lastSync.getTime()} ${date.getTime()} ${node.timeLimit * 1000}`);
                    if (node.timeLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.timeLastAlert.getTime()) {
                        setTimeout(() => {
                            this.timeOut(node);
                        }, 10000);
                    } else {
                        Logger.error(`Alert already sent to ${node.host}`);
                    }
                }
            }
        });
    }

    @Cron('0 0 9 * * 1')
    async serverAlert() {
        try {
            const user = (await this.usersService.findAdmin()).map(user => user.phone);
            await this.smsService.sendSms(user, `서버 주간 알림`);
        } catch (error) {
            Logger.error(`Alert can not sent: ${error}`);
        }
    }

    async timeOut(id: Nodes) {
        const node = await this.nodesService.findByHost(id.host);
        const date = new Date();
        if (date.getTime() - node.timeLimit * 1000 > node.lastSync.getTime()) {
            Logger.error(`Node ${node.host} is not synced: ${node.lastSync.toISOString()} ${date.toISOString()}`);
            Logger.debug(`- ${node.lastSync.getTime()} ${date.getTime()} ${node.timeLimit * 1000}`);
            if (node.timeLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.timeLastAlert.getTime()) {
                try {
                    const user = (await this.usersService.findAdmin()).map(user => user.phone);
                    const KST = date.getTime() + (9 * 60 * 60 * 1000);
                    const datetime = new Date(KST).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                    
                    await this.smsService.sendSms(user, `${node.host} 노드의 동기화가 ${node.timeLimit}초 이상 지연되었습니다.`+datetime);
                    node.timeLastAlert = date;
                    await this.nodesService.updateNode(node.id, node);
                } catch (error) {
                    Logger.error(`Alert can not sent to ${node.host}: ${error}`);
                }
            } else {
                Logger.error(`Alert already sent to ${node.host}`);
            }
        }
    }
}