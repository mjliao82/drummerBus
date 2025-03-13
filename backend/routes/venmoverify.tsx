import { WebhookEvent } from '@paypal/checkout-server-sdk';
import { v1 as uuidv1 } from 'uuid'; // Assuming this is for unique signature verification


export const verifyWebhookSignature = (event: WebhookEvent): boolean => {
  //signature verification logic here

  return true; 
};
