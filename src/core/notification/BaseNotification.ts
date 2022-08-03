import { EmailRequest, NotificationStatus } from 'notifme-sdk';
import { appConfig } from '@src/config';
import { intersection } from "lodash";
import { sendEmail } from '@common/helpers/notifmeHelper';
import { EmailData, NotificationData } from './types';
import { Producer } from '@core/queue/Producer';

export abstract class Notification {
    //generic properties to be handled by child classes
    protected job: Producer<EmailRequest>;
    protected emailJob: Producer<EmailRequest>;
    /**
     * overload the getter returning array of channels through which this notification can be sent. Possible channel are mail
     * @date 2022-07-30
     * @returns {Array<string>} ["mail"]
     */
    protected get channels() : Array<"mail" | "sms"> {
        //if any custom logic
        return ["mail"];
    }
    
    /**
     * overload the getter returning queue broker name that will be used when the notification is submitted. can be either redis or none
     * @date 2022-07-30
     * @returns {string} "redis" | "none"
     */
    protected get queue() : "redis" | "none" {
        //if any custom logic
        return "none";
    }

    /**
     * overload the function generate html view configuration of the e-mail
     * @date 2022-07-30
     * @param {any} receiver any
     * @param {any} payload any
     * @returns {Partial<EmailRequest>}
     */
    protected MailFormat(receiver: any, payload?: any) : Partial<EmailRequest> {
        throw new Error('MailFormat function must be implemented in order to use mail channel')
    };

    //base class specific functions to handle mail
    /**
     * generates mail configuration by combining overloaded values and default ones
     * @date 2022-07-30
     * @param {any} receiver any
     * @param {any} payload any
     * @returns {any}
     */
    private GenerateMailFormat(receiver: any, payload?: any){
        return {
            from: appConfig?.mail_from ?? 'sender@goes.here',
            to: receiver.email,
            subject: this.constructor.name,
            ...this.MailFormat(receiver.receiver, payload)
        }
    }

    /**
     * register appropriate job 
     * @date 2022-07-30
     * @param {any} data EmailRequest
     * @param {[any]} [options] Options
     * @returns {Promise}
     */
    private async jobProducer(channel: "mail", data: any){
        if(channel == "mail"){
            if(!this.job && !this.emailJob)
                throw new Error('Since you are using queue, a job instance must be provided through constructor');
            this.emailJob ? this.emailJob.produce(data) : this.job.produce(data);
        }
    }

    /**
     * process the queue to send notifications
     * @date 2022-07-30
     * @param {any} data Object
     * @returns {Promise}
     */
    private async processQueue(data: {
        channel: "mail", 
        queue: "none" | "redis", 
        request: any, 
        delay?: string
    }){
        if(data.queue == 'none'){
            return await sendEmail(data.request);
        }else if(data.queue == 'redis'){
            //TODO: make jobOptions based on delay and pass that to jobProducer
            //so that delayed notifications can be achieved
            await this.jobProducer(data.channel, data.request); 
            return {
                status: "success",
                info: 'Request has been added to the queue'
            } as NotificationStatus;
        }
    }

    /**
     * send email notification to the receiver
     * @date 2022-07-30
     * @param {any} data Object
     * @returns {Promise}
     */
    async mail(data: {
        receiver?: EmailData, 
        payload?: any, 
        delay?: string, 
        sync?: boolean, 
        email?: string
    }){
        if(!data.receiver) data.receiver = {};
        if(!data.receiver.email){
            if(!data.email) throw new Error('Receiver object must contain email or email must be passed explicitly');
    
            data.receiver.email = data.email;
        }
        if(data.sync){
            return await sendEmail(this.GenerateMailFormat(data.receiver, data.payload) as EmailRequest);
        }else{
            return await this.processQueue({ channel: "mail", queue: this.queue, request: this.GenerateMailFormat(data.receiver, data.payload), delay: data.delay});
        }
    }

    /**
    * notify receiver through multiple channel 
    * @date 2022-07-30
    * @param {any} data object
    * @returns {Promise}
    */
    async notify(data: { 
        receiver?: NotificationData, 
        payload?: any, 
        delay?: string, 
        channels?: string[], 
        mediums?: {
            email?: string
        } 
    }){
        try{
            if(!data.channels){
                data.channels = this.channels;
            }else{
                data.channels = intersection(data.channels, this.channels);
            }
            let response: {
                mail?: NotificationStatus
            } = {}; 
            await Promise.all(data.channels.map( async channel => {
                if(channel == 'mail'){
                    response.mail = await this.mail({
                        receiver: data.receiver, 
                        delay: data.delay, 
                        payload: data.payload, 
                        email: data.mediums?.email
                    });
                }
            }));

            return response;
        }catch(err){
            throw(err);
        }
    }
}