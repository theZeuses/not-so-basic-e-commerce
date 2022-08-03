import { Producer } from "@core/queue/Producer";
import { EmailRequest } from 'notifme-sdk';
import { Queue } from 'bull';
import { Job } from "@common/enums";
import { AbandonedCartNotifierQueue } from '@providers/queue/queue.provider';

export class AbandonedCartNotifierProducer extends Producer<EmailRequest> {
    constructor(queue: Queue){
        super(queue, Job.ABANDONED_CART_NOTIFIER);
    }
}

export const abandonedCartNotifierProducer = new AbandonedCartNotifierProducer(AbandonedCartNotifierQueue);