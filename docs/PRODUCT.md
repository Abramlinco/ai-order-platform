# ATIVTRAD Product Specification

## 1. Product Overview

ATIVTRAD is an AI-powered commerce and business operations platform
designed to help businesses manage the complete journey from
customer interaction to completed trade.

The platform combines conversational AI, product management,
inventory, quoting, payments, delivery, rider operations,
invoicing, customer feedback, analytics, and reporting.

ATIVTRAD is designed primarily for businesses that want to sell and
serve customers through conversational channels while maintaining
structured business operations through a web dashboard.

---

## 2. Product Philosophy

ATIVTRAD is built around the concept of **Active Trade**.

A business is continuously performing activities such as:

- Finding customers
- Answering customer questions
- Presenting products
- Confirming availability
- Pricing products
- Preparing quotes
- Receiving payments
- Preparing orders
- Delivering goods
- Receiving customer feedback

ATIVTRAD brings these activities into one connected system.

The goal is not simply to create an ordering chatbot.

The goal is to create a system that helps businesses move from:

**Customer Interest → Trade → Payment → Fulfillment → Completed Trade**

with as much unnecessary manual work removed as possible.

---

## 3. The Problem ATIVTRAD Solves

Many businesses manage customer sales through conversations,
especially through messaging platforms.

This can create operational problems:

- Customers ask questions repeatedly.
- Staff manually check product availability.
- Product prices may be communicated incorrectly.
- Quantities may be recorded incorrectly.
- Delivery charges may be calculated manually.
- Orders may be lost in conversations.
- Payment confirmation may be handled manually.
- Stock may become inaccurate.
- Delivery coordination may require multiple conversations.
- Business owners have limited visibility into performance.
- Customer feedback may not be systematically collected.

ATIVTRAD is intended to connect these activities into one workflow.

---

## 4. Target Users

ATIVTRAD is intended for businesses that sell products or services
and need structured tools for managing customer transactions.

Potential users include:

- Retail businesses
- Restaurants
- Food businesses
- Fashion businesses
- Electronics businesses
- Beauty businesses
- Household goods businesses
- General merchants
- Businesses with local delivery operations
- Businesses with interstate fulfillment
- Other businesses conducting recurring customer transactions

The platform should remain flexible enough to support different
business categories rather than being designed exclusively for one
industry.

---

## 5. Primary Customer Channel

The primary customer interaction is designed around WhatsApp.

Customers should not need to understand the internal ATIVTRAD
dashboard or operational system.

From the customer's perspective, the experience should feel like
communicating with the business.

ATIVTRAD operates behind the conversation to coordinate:

- Product information
- Product variants
- Availability
- Quantity
- Delivery information
- Pricing
- Quotes
- Payment
- Order status
- Delivery
- Feedback

---

## 6. AI Role

The AI is the conversational layer of ATIVTRAD.

Its responsibilities include:

- Understanding customer requests
- Asking clarifying questions
- Helping customers choose products or variants
- Communicating verified product information
- Collecting quantities
- Collecting delivery information
- Presenting quotes
- Explaining payment instructions
- Communicating order and delivery updates
- Handling reasonable customer questions
- Offering alternatives when a customer declines a quote
- Maintaining a natural sales/customer-support conversation

### AI Limitation

The AI must not become the source of truth for transactional data.

The backend must determine:

- Stock
- Price
- Delivery fee
- Quote totals
- Payment status
- Inventory status
- Refund status
- OTP validity
- Delivery completion

The AI communicates information that the backend has established.

---

## 7. Customer Experience

The customer experience should be conversational and simple.

A typical interaction may look like:

### Step 1 — Product Request

Customer:

> I need chicken.

AI:

> Which would you like: Full Chicken, Half Chicken, Legs, or Wings?

The AI should not assume a variant when multiple variants exist.

### Step 2 — Availability

The backend checks whether the selected product/variant is
available and whether sufficient stock exists.

### Step 3 — Price

The verified product or variant price is presented.

### Step 4 — Quantity

The customer provides the desired quantity.

### Step 5 — Delivery

The AI requests the required delivery address/location information.

### Step 6 — Delivery Calculation

ATIVTRAD determines whether the delivery is Local or Interstate
and obtains the applicable delivery pricing.

### Step 7 — Quote

The customer receives a complete quote containing the relevant
commercial information.

### Step 8 — Decision

The customer explicitly chooses:

**ACCEPT**

or

**DECLINE**

### Step 9 — Payment

If accepted, the customer receives the applicable payment option
and business payment information.

### Step 10 — Payment Verification

ATIVTRAD verifies the payment through the payment provider.

### Step 11 — Order Confirmation

After confirmed payment, the order is confirmed and inventory is
committed.

### Step 12 — Fulfillment

The order enters the appropriate fulfillment process.

### Step 13 — Delivery Verification

For deliveries requiring OTP verification, the customer provides
the OTP to the rider, who submits it to ATIVTRAD for backend
verification.

### Step 14 — Feedback

After successful delivery, the customer may provide feedback.

---

## 8. Quote Philosophy

A quote represents a commercial offer generated from verified
business information.

A quote should be based on:

- Selected products
- Selected variants
- Quantity
- Current verified prices
- Available stock
- Delivery location
- Delivery type
- Delivery fee
- Applicable delivery information
- Quote validity

The quote should give the customer enough information to make an
informed decision.

### Customer Acceptance

Customer acceptance is the normal commercial acceptance of the quote.

The business owner should not be required to manually approve every
normal order after the customer has accepted the quote and payment
has been successfully verified.

---

## 9. Declined Quotes

A declined quote should not automatically terminate the sales
conversation.

The AI may act as a salesperson and offer reasonable alternatives.

Examples:

- Smaller quantity
- Different product variant
- Another available product
- Alternative configuration

The AI must not manipulate or arbitrarily alter delivery pricing.

If the customer changes the order, ATIVTRAD should generate a new
quote based on the updated information.

---

## 10. Inventory Philosophy

Inventory must be validated before the customer can proceed to
payment.

The intended inventory lifecycle is:

**Available**

→ **Reserved**

→ **Payment Confirmed**

→ **Committed**

If payment fails, expires, or otherwise does not complete within the
applicable reservation period, reserved inventory should be released.

The system should avoid allowing customers to pay for quantities
that the backend already knows are unavailable.

---

## 11. Delivery Philosophy

Delivery is treated as a separate operational service.

ATIVTRAD should not hard-code one delivery company into the entire
platform.

Instead, delivery functionality should use replaceable provider
adapters/services.

This allows different delivery providers or pricing methods to be
introduced later.

### Local Delivery

Local delivery is determined according to the business and
customer location classification.

The current classification rule is based on state:

- Same state → Local
- Different state → Interstate

### Interstate Delivery

Interstate delivery follows the merchant's configured interstate
delivery method.

---

## 12. Delivery Pricing

Local delivery pricing should come from the delivery-pricing
service/provider rather than allowing the merchant to arbitrarily
set the fee for each local order.

Interstate pricing can support configurable methods such as:

- Fixed
- Per Order
- External Provider

The delivery-pricing architecture is designed to support multiple
providers.

The development environment currently supports a mock provider for
testing.

---

## 13. Delivery ETA

Delivery ETA is separate from delivery pricing.

ETA may include:

- Estimated duration
- Distance
- Traffic awareness
- Provider information

ETA is an estimate and should not be presented as a guaranteed
delivery time.

If delivery information changes significantly, the applicable
pricing and ETA should be recalculated.

---

## 14. Business Operating Modes

ATIVTRAD supports different operating states.

### Online

The business is fully operational.

Customers may:

- Request products
- Receive quotes
- Accept quotes
- Pay
- Create orders
- Proceed through fulfillment

### Offline — Quote Only

The business can continue customer assistance and quote generation,
but payment and active order processing are unavailable.

When the business resumes, previously generated quotes should be
revalidated before payment.

### Closed — No Orders

The business is unavailable for new quote/order processing.

### Temporary Emergency Offline

The business should be able to temporarily stop normal operations
without permanently changing its regular schedule.

---

## 15. Business Operating Hours

Businesses should be able to configure their normal operating days
and hours.

For example:

- Monday — Open
- Tuesday — Open
- Wednesday — Open
- Thursday — Open
- Friday — Open
- Saturday — Open
- Sunday — Closed

The AI should use the business's configured availability when
communicating with customers.

The owner should also be able to temporarily override the normal
schedule when necessary.

---

## 16. Payment Philosophy

ATIVTRAD is designed to integrate with Paystack.

The intended architecture is merchant-owned payment processing.

Each merchant should connect their own payment account.

ATIVTRAD should not operate as a central account holding all
merchant customer payments.

Payment confirmation must be based on trusted backend verification
and/or payment-provider events.

Customer statements or screenshots alone must not be considered
sufficient proof of payment.

---

## 17. Cancellation and Refund Philosophy

Normal customer acceptance should not require routine merchant
approval.

Merchant cancellation is intended for exceptional operational
situations.

Where a paid order is cancelled by the merchant under an allowed
cancellation process:

1. Cancellation reason is recorded.
2. The cancellation is recorded in the audit trail.
3. The applicable payment transaction is identified.
4. A refund may be initiated against the original transaction.
5. Refund status is tracked.
6. The customer is informed of the actual refund status.

ATIVTRAD should not tell a customer that a refund is complete until
the payment provider confirms the relevant status.

Merchant-caused cancellation should be subject to operational
controls and limits to discourage abuse.

---

## 18. Invoice

The invoice is an identifiable transaction record.

It should contain appropriate business information, including:

- Business name
- Business phone
- Business address
- Transaction information
- Products
- Quantities
- Prices
- Delivery fee
- Total
- Payment information where applicable

Business identity information must come from the merchant's
configured business information rather than hard-coded values.

---

## 19. Rider Operations

Local deliveries use the rider system.

The intended rider lifecycle is:

**Confirmed**
→ **Finding Rider**
→ **Rider Assigned**
→ **Rider Accepted**
→ **Going to Business**
→ **Arrived at Business**
→ **Order Picked Up**
→ **Out for Delivery**
→ **Arrived at Customer**
→ **OTP Verification**
→ **Delivered**
→ **Feedback**

Routine local orders should use automatic rider assignment where
the applicable conditions are satisfied.

Merchant intervention should be reserved for exceptional situations
such as:

- Hold
- Resume
- Cancel

---

## 20. Rider Account States

Riders may be:

### Active

Available for normal operations.

### Suspended

Temporarily restricted.

### Blocked

Restricted from operational participation under a stronger
administrative control.

### Removed

No longer active in the business's rider pool.

Removing a rider should not destroy historical order or delivery
records.

---

## 21. Customer Feedback

Customer feedback is collected after successful delivery.

The purpose is to provide the merchant with insight into:

- Customer satisfaction
- Delivery experience
- Service quality
- Operational problems

Feedback should contribute to merchant-facing insights and
analytics.

---

## 22. Product Management

Products may contain variants.

Example:

**Chicken**

- Full Chicken
- Half Chicken
- Legs
- Wings

Each variant can have its own:

- Name
- Price
- Stock

The system should validate that a selected variant belongs to the
selected product.

---

## 23. Product Import

ATIVTRAD is intended to support bulk product management.

### CSV/Excel Import

The intended process is:

**Upload**
→ **Parse**
→ **Validate**
→ **Preview**
→ **Fix Errors**
→ **Owner Confirmation**
→ **Database Transaction**

Invalid or unsafe data should prevent the import from being
committed.

### Voice Product Import

The intended process is:

**Voice**
→ **Speech-to-Text**
→ **AI Extraction**
→ **Structured Product Data**
→ **Validation**
→ **Preview**
→ **Owner Confirmation**
→ **Database**

AI must not directly publish unverified product information.

Bulk import and voice import should share a common validation
pipeline where practical.

---

## 24. Analytics and Reporting

ATIVTRAD is intended to provide merchants with operational
visibility.

Potential analytics include:

- Sales
- Orders
- Customers
- Product performance
- Inventory
- Delivery performance
- Rider performance
- Customer feedback
- Business activity

Report downloads and advanced analytics may be restricted by
subscription plan.

---

## 25. Subscription Model

ATIVTRAD is intended to operate as a SaaS platform.

Businesses subscribe to plans that provide different capabilities.

The system should support:

- Plans
- Features
- Feature entitlements
- Usage limits
- Subscription status

Feature access must be enforced by the backend.

The frontend may hide unavailable features for better user
experience, but frontend visibility must never be the security
boundary.

---

## 26. ATIVTRAD Admin

The platform owner will have a separate administrative environment.

The admin system is intended to manage:

- Businesses
- Plans
- Subscriptions
- Feature access
- Platform analytics
- System health
- Integration health
- Platform settings
- Feature releases
- Audit logs
- Abuse/security controls
- Administrative users

The merchant dashboard and ATIVTRAD Admin are separate concerns.

---

## 27. Privacy and Security Philosophy

ATIVTRAD should follow a privacy-first architecture.

Platform administrators should not casually access merchant
customer conversations or private business information.

Administrative access should be controlled and auditable.

Sensitive credentials and payment secrets must not be exposed to
unauthorized users.

Business payment-detail changes should receive stronger security
controls such as re-authentication, verification, audit logging,
and appropriate notifications.

---

## 28. Platform Scalability

ATIVTRAD is intended to become a multi-tenant SaaS platform.

The eventual architecture will isolate each business's data and
operations.

Conceptually:

ATIVTRAD

- Business A
- Business B
- Business C
- Business D

Each business should only access its own:

- Customers
- Products
- Orders
- Quotes
- Payments
- Riders
- Settings
- Reports

The platform administration layer operates above individual
business tenants.

Proper tenant isolation must be established before real-world
multi-business onboarding.

---

## 29. Product Development Philosophy

ATIVTRAD should be developed incrementally.

The preferred development cycle is:

**Business Rule**
→ **Backend**
→ **Backend Test**
→ **Frontend**
→ **Frontend Test**
→ **Documentation**
→ **Git Commit**

Existing working functionality should not be unnecessarily rebuilt.

Major architectural changes should be introduced when required by
a genuine business or technical requirement.

---

## 30. Product Success

The ultimate measure of ATIVTRAD is not the number of screens in
the application.

Success means that a real business can use ATIVTRAD to reliably
move customers through:

**Interest**
→ **Conversation**
→ **Product Selection**
→ **Quote**
→ **Acceptance**
→ **Payment**
→ **Fulfillment**
→ **Delivery**
→ **Feedback**

while reducing unnecessary manual work for the business owner.

ATIVTRAD should make active trade simpler, more reliable,
measurable, and scalable.