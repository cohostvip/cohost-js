// Payment field only (embed a card field inside your own cart UI).
export {
  mountPaymentElement,
  type PaymentElementOptions,
  type PaymentElementHandle,
} from './mount';

// Full hosted checkout (embed the whole cart: tickets + coupon + customer + payment).
export {
  mountCheckout,
  type CheckoutOptions,
  type CheckoutHandle,
} from './checkout';

// Shared iframe core (advanced / custom embeds).
export {
  createCohostFrame,
  resolveTarget,
  DEFAULT_COHOST_SANDBOX,
  type CohostFrameHandle,
  type CohostFrameControls,
  type CreateCohostFrameOptions,
} from './frame';

export {
  type CohostPaymentFrameTheme,
  DEFAULT_PAYMENT_ORIGIN,
  resolvePaymentOrigin,
  detectEnvelopingTheme,
  detectInputStyle,
  resolveBackground,
  buildSrc,
} from './theme';

export { dispatchPayUpMessage, type PayMessageHandlers } from './messages';

// cohost-pay protocol (payment field).
export {
  PAY_MESSAGE_TYPE,
  isPayUpMessage,
  isPayDownMessage,
  toPaymentSuccess,
  type PaymentProvider,
  type PaymentFieldState,
  type PaymentUpMessage,
  type PaymentDownMessage,
  type PaymentOrderResult,
  type PaymentSuccessResult,
} from './protocol';

// cohost-checkout protocol (full hosted checkout).
export {
  CHECKOUT_MESSAGE_TYPE,
  isCheckoutUpMessage,
  type CheckoutOrderResult,
  type CheckoutUpMessage,
  type CheckoutDownMessage,
} from './checkout-protocol';
