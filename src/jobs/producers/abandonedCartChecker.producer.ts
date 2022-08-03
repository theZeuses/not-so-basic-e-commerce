import { Producer } from "@core/queue/Producer";
import { Queue } from 'bull';
import { Job } from "@common/enums";
import { AbandonedCartCheckerQueue } from '@providers/queue/queue.provider';

export class AbandonedCartCheckerProducer extends Producer<undefined> {
    constructor(queue: Queue){
        super(queue, Job.ABANDONED_CART_CHECKER, {
            repeat: {
                cron: '0 */4 * * *'
            }
        });
    }
}

export const abandonedCartCheckerProducer = new AbandonedCartCheckerProducer(AbandonedCartCheckerQueue);