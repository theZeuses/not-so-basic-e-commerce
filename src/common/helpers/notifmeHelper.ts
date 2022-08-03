import NotifmeSdk, { EmailRequest, Notification, NotificationStatus } from 'notifme-sdk';
import { notifmeConfig } from '@src/config';

var notifme: NotifmeSdk = new NotifmeSdk({});

//generate a singleton of notifme sdk
export const initializeNotifme = () => {
    notifme = new NotifmeSdk(notifmeConfig);
    console.log('notifme initialized...')
}

export async function sendEmail(email: EmailRequest) : Promise<NotificationStatus> {
    try{
        return await notifme.send({email});
    }catch(err){
        throw(err);
    }
}

export async function send(notification_requests: Notification) : Promise<NotificationStatus> {
    try{
        return await notifme.send(notification_requests);
    }catch(err){
        throw(err);
    }
}

export default notifme;