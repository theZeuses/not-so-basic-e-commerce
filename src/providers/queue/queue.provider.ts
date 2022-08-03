import { bullConfig } from "./bull/bull.config";
import * as Queue from 'bull'; 

export const OrderConfirmedEmailQueue = new Queue('ORDER_CONFIRMED_EMAIL_QUEUE', bullConfig);
export const AbandonedCartNotifierQueue = new Queue('ABANDONED_CART_NOTIFIER_QUEUE', bullConfig);
export const AbandonedCartCheckerQueue = new Queue('ABANDONED_CART_CHECKER_QUEUE', bullConfig);