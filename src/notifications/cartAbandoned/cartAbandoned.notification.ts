import { Notification } from "@core/notification/BaseNotification";
import { EmailRequest } from "notifme-sdk";
import { mailView } from './views';
import { OrderConfirmationEmailProducer, orderConfirmedEmailProducer } from '@jobs/producers/orderConfirmationEmail.producer';
import { discountedMailView } from './views/cartWithDiscountAbandoned.mail';

export class CartAbandonedNotification extends Notification {
    protected readonly emailJob: OrderConfirmationEmailProducer = orderConfirmedEmailProducer;
    
    protected get channels() : Array<"mail">{
        return ["mail"];
    }

    protected get queue(): "redis" | "none" {
        return "redis";
    }

    protected MailFormat(receiver: any, payload?: any): Partial<EmailRequest> {
        return {
            subject: `Your cart is waiting for you.`,
            html: payload.discounted_product_count > 0 ? discountedMailView(payload) : mailView(payload)
        }
    }
}