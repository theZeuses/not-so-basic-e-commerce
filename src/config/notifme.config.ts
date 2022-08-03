import { EmailProvider, EmailRequest, MultiProviderStrategy, Options, Provider, Request } from 'notifme-sdk';
import * as dotenv from "dotenv";
dotenv.config();

/*
 * `providers` is an array containing all the instances that were
 * created from your configuration.
 */
const customStrategy: MultiProviderStrategy = (providers: any) => async (request: Request) => {
    // Choose one provider using your own login
    const provider = providers[Math.floor(Math.random() * providers.length)];
  
    try {
      const id = await provider.send(request)
      return {id, providerId: provider.id}
    } catch (error: any) {
      error.providerId = provider.id
      throw error
    }
}

//this provider is only for development
const loggerProvider: Provider = {
    type: 'logger'
}

//these are for production
//email providers
const smtpProvider: EmailProvider = {
    type: 'smtp',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT == '25' ? 25 : (process.env.SMTP_PORT == '465' ? 465 : 587),
    secure: process.env.SMTP_SECURE == 'true' ? true : false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
}

const sendmailProvider: EmailProvider = {
    type: 'sendmail',
    sendmail: true,
    newline: 'unix',
    path: process.env.SENDMAIL_PATH
}

const mailgunProvider: EmailProvider = {
    type: 'mailgun',
    apiKey: process.env.MAILGUN_KEY,
    domainName: process.env.MAILGUN_DOMAIN
}

const mandrillProvider: EmailProvider = {
    type: 'mandrill',
    apiKey: process.env.MANDRILL_KEY
}

const sendgridProvider: EmailProvider = {
    type: 'sendgrid',
    apiKey: process.env.SENDGRID_KEY
}

const sparkpostProvider: EmailProvider = {
    type: 'sparkpost',
    apiKey: process.env.SPARKPOST_KEY
}

const sesProvider: EmailProvider = {
    type: 'ses',
    region: process.env.SES_REGION,
    accessKeyId: process.env.SES_KEY_ID,
    secretAccessKey: process.env.SES_KEY,
    sessionToken: process.env.SES_TOKEN // optional
}

const customProvider: EmailProvider = {
    type: 'custom',
    id: 'my-custom-email-provider...',
    send: async (request: EmailRequest) => {
      // Send email

      return 'id...'
    }
}

export const notifmeConfig: Options = {
    useNotificationCatcher: false, //use true if you want to catch the notification on notification catcher (package must be installed). If true then channel option will be ignored so only use in development
    channels: {
        email: {
            multiProviderStrategy: 'fallback', //can be fallback, no-fallback, roundrobin
            providers: [smtpProvider] //choose the providers to use
        }
    }
}