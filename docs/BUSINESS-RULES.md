# ATIVTRAD Business Rules

This document contains the core business rules that govern how
ATIVTRAD should behave.

These rules are more important than individual UI implementations.
Frontend and backend functionality must follow these rules.

---

## 1. Core System Principle

ATIVTRAD follows this principle:

> AI communicates and assists. The backend validates and controls.
> The database records the truth.

The AI must never be treated as the authoritative source for
transactional facts.

---

## 2. Customer Interaction

Customers primarily interact with the business through WhatsApp.

The customer should not need to understand ATIVTRAD's internal
systems.

ATIVTRAD should make the conversation feel like a natural business
sales/customer-support interaction.

---

## 3. Product Identification

When a customer requests a product:

1. ATIVTRAD identifies the requested product.
2. If the product has multiple variants, the AI must ask the
   customer to choose a variant.
3. The AI must not arbitrarily select a variant when the customer's
   request is ambiguous.

Example:

Customer:

> I need chicken.

If the business has:

- Full Chicken
- Half Chicken
- Legs
- Wings

the AI should ask the customer which option they want.

---

## 4. Product and Variant Validation

The backend must validate:

- Product existence
- Variant existence
- Variant ownership by the selected product
- Product/variant availability
- Requested quantity
- Available stock

The AI must not invent product information.

---

## 5. Pricing

Product prices must come from the backend/database.

The AI must not independently invent or modify a product price.

The price presented to the customer must correspond to the current
validated product or variant price used by ATIVTRAD.

---

## 6. Quantity

Customer quantity must be explicitly collected when required.

Quantity must be:

- Present
- Numeric
- A positive whole number
- Within available stock

A quote must not proceed when the requested quantity exceeds
available stock.

---

## 7. Customer Location

Delivery information must be collected before a final quote is
generated.

The delivery location should contain enough information for ATIVTRAD
to determine the applicable delivery process and calculate delivery
pricing.

The system should support structured location information such as:

- Address
- State
- Latitude
- Longitude
- Place ID where available

---

## 8. Delivery Classification

ATIVTRAD currently classifies delivery using the configured
business state and customer state.

### Local

Business state equals customer state.

### Interstate

Business state differs from customer state.

State comparison must be case-insensitive.

A missing required state must result in validation failure.

---

## 9. Local Delivery Pricing

Local delivery pricing must be determined by the delivery pricing
service/provider.

The merchant should not arbitrarily override the provider-derived
local delivery price during normal quoting.

The delivery provider architecture should remain replaceable.

---

## 10. Interstate Delivery Pricing

Interstate delivery is controlled by the merchant's configured
interstate delivery settings.

Supported pricing concepts include:

- Fixed
- Per Order
- External Provider

The system must not generate an interstate delivery price when the
required pricing configuration is missing.

---

## 11. Delivery Provider Architecture

Delivery providers must be implemented through a service/provider
layer.

This prevents the core ATIVTRAD business logic from becoming
dependent on one delivery company.

The development environment may use a mock provider.

Production delivery providers must return validated delivery
information.

---

## 12. Delivery ETA

Delivery ETA is separate from delivery pricing.

ETA may contain:

- Estimated duration
- Distance
- Traffic-awareness information
- Provider

ETA is an estimate and must not be presented as a guaranteed
delivery time.

The system must not falsely represent development mock data as
real-world traffic data.

---

## 13. Quote Creation

A quote may only be considered ready when the necessary information
has been validated.

A quote should contain:

- Customer
- Products
- Variants where applicable
- Quantities
- Unit prices
- Product subtotal
- Delivery fee
- Delivery type
- Total
- Currency
- Delivery information
- Applicable ETA information
- Expiry information

---

## 14. Quote Calculation

The quote total must be calculated by the backend.

Conceptually:

Product Subtotal + Delivery Fee = Total

The frontend and AI must not be trusted to calculate the authoritative
transaction total.

---

## 15. Quote Expiry

Quotes should have an expiry period.

A quote that has expired must not automatically become payable.

Before payment is allowed, ATIVTRAD must ensure that the quote is
still valid.

---

## 16. Customer Quote Acceptance

Customer acceptance is the normal commercial acceptance of the
quote.

The customer explicitly chooses to accept or decline.

The business owner does not need to manually approve every normal
order after customer acceptance.

---

## 17. Declined Quote

A declined quote should not necessarily terminate the sales
conversation.

The AI may continue acting as a salesperson and offer reasonable
alternatives.

Examples include:

- Smaller quantity
- Different variant
- Alternative available product

The AI must not manipulate delivery pricing.

If the customer changes the requested order, ATIVTRAD should generate
a new quote based on the new validated information.

---

## 18. Customer Inactivity

If the customer stops responding for the configured inactivity
period, the AI may politely end the active conversation.

The initial target is approximately 1–2 minutes.

This timeout should eventually be configurable.

---

## 19. Business Operating Modes

ATIVTRAD supports three primary business states.

### Online

Normal trade processing is available.

### Offline — Quote Only

The AI may:

- Answer product questions
- Check product availability
- Collect quantity
- Collect delivery details
- Generate and save quotes

Payment and active order processing are unavailable.

When the business returns online, old quotes must be revalidated
before payment.

### Closed — No Orders

The business is unavailable for new quote/order processing.

---

## 20. Business Operating Hours

Businesses should be able to define normal operating days and hours.

The configured schedule should influence the business's operating
availability.

A temporary manual override should be possible for exceptional
situations.

---

## 21. Payment

ATIVTRAD uses Paystack as the intended payment provider.

Each merchant should use their own payment account.

ATIVTRAD should not treat all merchant payments as funds belonging
to one central OrderPilot/ATIVTRAD merchant account.

---

## 22. Payment Verification

Payment must be verified by the backend.

Acceptable verification should come from trusted payment-provider
mechanisms such as server-side transaction verification and/or
trusted payment events.

The following are not sufficient by themselves:

- Customer saying they paid
- Customer sending a screenshot
- Customer providing an unverified transaction reference

---

## 23. Inventory Reservation

Inventory should be protected against overselling.

The intended lifecycle is:

Available Stock
→ Reserved
→ Payment Confirmed
→ Committed

A reservation should prevent another transaction from consuming the
same reserved stock.

---

## 24. Inventory Commitment

Inventory should be permanently committed/deducted after confirmed
payment.

The system must not rely on a stale stock check performed much
earlier in the conversation.

If requested quantity cannot be safely fulfilled, the customer must
not be allowed to complete payment for that quantity.

---

## 25. Failed Payment

If payment fails or does not complete within the applicable period:

- Payment must not be marked Confirmed.
- Inventory reservation should be released.
- The customer should be able to retry or begin a new payment flow
  where appropriate.

---

## 26. Order Confirmation

Normal order confirmation occurs after successful payment
verification.

The business owner should not be required to manually approve every
normal paid order.

---

## 27. Merchant Hold

The merchant may place an exceptional order on Hold.

Hold is an operational intervention and is not part of the normal
customer ordering flow.

The system should record:

- Who placed the hold
- When it occurred
- Reason
- Relevant order state

---

## 28. Merchant Resume

A held order may be resumed by an authorized merchant user.

The system should record:

- Who resumed it
- When it occurred
- Relevant operational state

---

## 29. Merchant Cancellation

Merchant cancellation is an exceptional operational action.

It should not be the normal way of processing orders.

Cancellation should require an appropriate reason and create an
audit record.

---

## 30. Merchant Cancellation Limits

Repeated merchant-caused cancellations should be subject to
operational controls.

The platform may implement a configurable rolling-period limit,
such as a maximum number of merchant cancellations within seven
days.

The exact limit should be configurable rather than permanently
hard-coded.

Repeated cancellations may trigger:

- Warnings
- Restrictions
- Account review
- Other platform controls

---

## 31. Paid Order Cancellation

If a merchant cancels a paid order under an allowed cancellation
process:

1. The cancellation is recorded.
2. The cancellation reason is recorded.
3. An audit event is created.
4. The original payment transaction is identified.
5. A refund is initiated where applicable.
6. Refund status is tracked.
7. The customer is informed of the actual refund state.

ATIVTRAD must not claim that a refund is complete before the payment
provider confirms the relevant status.

---

## 32. Refund Account Rule

ATIVTRAD should not provide a normal customer-facing form allowing
customers to enter an arbitrary alternative refund account.

Refunds should normally be associated with the original payment
transaction.

Exceptional payment-provider refund cases must be handled through
controlled administrative procedures.

---

## 33. Invoice Identity

Invoices must identify the actual merchant/business involved in the
transaction.

Business identity information should come from the merchant's
configured business information.

The system must not hard-code one business's information into
invoices.

---

## 34. OTP

A delivery OTP is generated after the applicable payment and order
confirmation process.

The OTP is provided to the customer.

The rider must not receive the customer's OTP in advance.

---

## 35. Delivery Completion

Delivery completion should primarily depend on backend verification
of the customer's OTP.

A rider's statement alone must not be treated as authoritative proof
of successful delivery.

---

## 36. Local Rider Assignment

After successful payment and order confirmation, eligible local orders
may enter automatic rider assignment.

Routine orders should not require manual merchant approval before
rider search begins.

---

## 37. Rider Availability

Only eligible active riders should participate in automatic rider
assignment.

Suspended, blocked, or removed riders must not be automatically
assigned.

---

## 38. Rider Lifecycle

The intended local delivery lifecycle is:

Confirmed
→ Finding Rider
→ Rider Assigned
→ Rider Accepted
→ Going to Business
→ Arrived at Business
→ Order Picked Up
→ Out for Delivery
→ Arrived at Customer
→ OTP Verification
→ Delivered
→ Feedback

The implementation may evolve as the delivery system develops, but
the core operational meaning of each state should remain clear.

---

## 39. Rider Account States

### Active

The rider can participate in normal delivery operations.

### Suspended

The rider is temporarily restricted.

### Blocked

The rider is strongly restricted from operational participation.

### Removed

The rider is no longer part of the active rider pool.

Removing a rider must not destroy historical delivery records.

---

## 40. Interstate Fulfillment

Interstate orders do not use the automatic local rider-dispatch
workflow.

After payment confirmation, the appropriate invoice and OTP process
continues while interstate fulfillment follows the merchant's
operational process.

---

## 41. Customer Feedback

Customer feedback should be requested after successful,
OTP-confirmed delivery.

Feedback should be available to the merchant through appropriate
dashboard insights.

The feedback system should help the business understand customer
and delivery experience.

---

## 42. Product Import

Bulk product import must follow:

Upload
→ Parse
→ Validate
→ Preview
→ Fix Errors
→ Owner Confirmation
→ Database Transaction

Invalid data must prevent unsafe import.

---

## 43. Voice Product Import

Voice product entry must follow:

Voice
→ Speech-to-Text
→ AI Extraction
→ Structured Data
→ Validation
→ Preview
→ Owner Confirmation
→ Database

AI must not directly publish unverified product information.

---

## 44. Product Import Validation

Bulk and voice product imports should use a common validation
pipeline where practical.

Validation errors should be clearly displayed to the merchant.

Import confirmation should remain unavailable while blocking errors
exist.

---

## 45. Subscription Plans

ATIVTRAD operates as a SaaS platform.

Businesses receive access to functionality according to their
subscription plan.

Plans may define:

- Features
- Usage limits
- Storage limits
- Report access
- Analytics access
- AI capabilities
- Import capabilities
- Other product capabilities

---

## 46. Feature Entitlements

Feature access must be enforced on the backend.

Frontend controls are not a security boundary.

For example, if voice product import is restricted to Premium:

A Premium business:

**Allowed**

A Basic business attempting to call the voice-import API directly:

**Rejected**

The backend should return an appropriate feature-access error.

---

## 47. Merchant Settings

Merchant settings control the merchant's own business configuration.

Examples include:

- Business identity
- Address
- Operating hours
- Delivery configuration
- Payment configuration
- Other business-level settings

Merchant settings must not provide access to ATIVTRAD platform-level
administration.

---

## 48. ATIVTRAD Admin

ATIVTRAD Admin is separate from the merchant dashboard.

ATIVTRAD Admin manages platform-level concerns such as:

- Businesses
- Plans
- Subscriptions
- Feature entitlements
- Platform analytics
- System health
- Integrations
- Platform settings
- Feature releases
- Audit logs
- Security and abuse controls
- Administrative users

---

## 49. Administrative Privacy

Platform administrators should not casually access merchant private
customer conversations or operational data.

Administrative access should be:

- Controlled
- Necessary
- Auditable
- Limited according to role

Legitimate support, security, legal, or operational access may be
provided through controlled procedures.

---

## 50. Business Data Isolation

Each business must only access its own business data.

This includes:

- Customers
- Products
- Variants
- Quotes
- Orders
- Payments
- Riders
- Reports
- Settings

The eventual multi-tenant architecture must enforce tenant
isolation at the backend/data-access level.

---

## 51. AI Truthfulness

The AI must never fabricate:

- Stock
- Prices
- Delivery fees
- Payment confirmation
- Refund completion
- Order status
- OTP verification
- Delivery completion

If the backend does not provide the required information, the AI
must not invent it.

---

## 52. Auditability

Important operational actions should be traceable.

Potential audit events include:

- Merchant cancellation
- Merchant hold
- Merchant resume
- Refund actions
- Payment-status changes
- Business-setting changes
- Rider suspension
- Rider blocking
- Administrative actions
- Security-sensitive changes

Audit records should include sufficient information to understand
what happened, when, and by whom.

---

## 53. Security-Sensitive Business Settings

Sensitive settings such as payment configuration changes should use
stronger security controls.

Potential controls include:

- Re-authentication
- Multi-factor authentication
- Phone verification
- Audit logging
- Security notifications

Sensitive payment credentials must never be unnecessarily exposed
through the frontend or logs.

---

## 54. Map and Location Validation

Business location should support:

- Address search
- Current device location/GPS
- Marker adjustment
- Human-readable address
- State
- Latitude
- Longitude
- Place ID where available

ATIVTRAD should not invent landmarks or location information.

If an address cannot be reliably resolved, the system should use
appropriate validation/fallback rules before accepting the business
location.

---

## 55. Development Rule

A feature should normally follow:

Business Rule
→ Backend
→ Backend Test
→ Frontend
→ Frontend Test
→ Documentation
→ Git Commit

Changes to established business rules must be documented.

---

## 56. Rule Priority

When frontend behavior, AI behavior, or documentation conflicts
with backend validation/business rules, the authoritative business
rules and backend controls take priority.

The UI and AI should be updated to reflect the correct rules.

---

## 57. Rule Change Management

When an established rule changes:

1. Identify the existing rule.
2. Record why it is changing.
3. Define the new rule.
4. Update the affected implementation.
5. Test the change.
6. Update documentation.
7. Record the change in the changelog.

This prevents accidental regression of important product decisions.