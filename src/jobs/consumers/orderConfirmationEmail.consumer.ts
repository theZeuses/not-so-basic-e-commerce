import { EmailRequest, NotificationStatus } from 'notifme-sdk';
import { Queue } from 'bull';
import { Job } from "@common/enums";
import { sendEmail } from "@common/helpers/notifmeHelper";
import { Consumer } from "@core/queue/Consumer";

export class OrderConfirmationEmailConsumer extends Consumer<EmailRequest> {
    constructor(queue: Queue){
        super(queue, Job.ORDER_CONFIRMATION_EMAIL_DIGEST);
    }
    
    protected async consumer(data: EmailRequest): Promise<NotificationStatus> {
        return await sendEmail(data);
    }
}