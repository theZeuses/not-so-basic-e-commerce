import { Notification } from "@core/notification/BaseNotification";
import { EmailRequest } from "notifme-sdk";
import { mailView } from './views';
import { OrderConfirmationEmailProducer, orderConfirmedEmailProducer } from '@jobs/producers/orderConfirmationEmail.producer';

export class OrderConfirmedNotification extends Notification {
    protected readonly job: OrderConfirmationEmailProducer = orderConfirmedEmailProducer;

    protected get channels() : Array<"mail">{
        return ["mail"];
    }

    protected get queue(): "redis" | "none" {
        return "redis";
    }

    protected MailFormat(receiver: any, payload?: any): Partial<EmailRequest> {
        return {
            subject: `Order #${payload.order_id} is confirmed`,
            html: mailView(payload)
        }
    }
}