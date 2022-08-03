import { Producer } from "@core/queue/Producer";
import { EmailRequest } from 'notifme-sdk';
import { Queue } from 'bull';
import { Job } from "@common/enums";
import { OrderConfirmedEmailQueue } from '@providers/queue/queue.provider';

export class OrderConfirmationEmailProducer extends Producer<EmailRequest> {
    constructor(queue: Queue){
        super(queue, Job.ORDER_CONFIRMATION_EMAIL_DIGEST);
    }
}

export const orderConfirmedEmailProducer = new OrderConfirmationEmailProducer(OrderConfirmedEmailQueue) 