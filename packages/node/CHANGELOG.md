# @cohostvip/cohost-node

## 0.1.16

### Patch Changes

- fixed api url

## 0.1.15

### Patch Changes

- Support for billing address

## 0.1.14

### Patch Changes

- Switched the authnet tokenizer to production"

## 0.1.12

### Patch Changes

- better error messages

## 0.1.11

### Patch Changes

- Can get attendees list for order. method: `orders.attendees`

## 0.1.10

### Patch Changes

- added support for trakcing code and context when starting a new cart session"

## 0.1.8

### Patch Changes

- Added **PaymentElementProvider** to handle tokenizing cards

## 0.1.7

### Patch Changes

- coupon methods added. including applyCoupon and deleteCoupon

## 0.1.6

### Patch Changes

- Can add coupon to cart

## 0.1.5

### Patch Changes

- Can send customer responses and partner forwarded data from cart

## 0.1.4

### Patch Changes

- Updates to types

## 0.1.3

### Patch Changes

- `processPayment` will process auth.net and other payment providers

## 0.1.2

### Patch Changes

- Can join existing groups (table commitment)

## 0.1.1

### Patch Changes

- Can join existing table commitment

## 0.1.0

### Minor Changes

- Cart supports table commitment, and packages

## 0.0.12

### Patch Changes

- Updated types, new `orders.list` method for fetching a list of orders

## 0.0.11

### Patch Changes

- Fixed the types export

## 0.0.10

### Patch Changes

- Add `events.attendees()` to fetch attendees for event.

## 0.0.9

### Patch Changes

- feat: support fetching order details

## 0.0.6

### Patch Changes

- Add `updateCartSession` method to `CohostCheckoutContext` for updating general `CartSession` fields.

## 0.0.5

### Patch Changes

- feat(cart): add updateItem and deleteItem methods to CartSession API

## 0.0.4

### Patch Changes

- Added cart sessions endpoints

## 0.0.3

### Patch Changes

- Add `requestWithOverrides()` to `CohostClient` for scoped request customization without affecting global client behavior.
- Add `requestWithOverrides()` method to `CohostClient` to support scoped header and base URL overrides, useful for mocking or testing environments.
