import { couponSchema } from "./coupon";
import { orderSchema } from "./order";
import { newsletterSubscriberSchema } from "./newsletter-subscriber";
import { sareeSchema } from "./saree";
import { siteSettingsSchema } from "./site-settings";

export const schemaTypes = [siteSettingsSchema, sareeSchema, couponSchema, orderSchema, newsletterSubscriberSchema];
