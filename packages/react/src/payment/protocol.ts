/**
 * The payment postMessage contract now lives in the framework-agnostic `@cohostvip/payment-element`
 * package (so plain-HTML/Webflow partners can use it without React). Re-exported here to keep
 * `@cohostvip/cohost-react`'s public surface unchanged.
 */
export {
  PAY_MESSAGE_TYPE,
  isPayUpMessage,
  isPayDownMessage,
  type PaymentProvider,
  type PaymentFieldState,
  type PaymentUpMessage,
  type PaymentDownMessage,
} from '@cohostvip/payment-element';
