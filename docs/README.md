# ATIVTRAD

ATIVTRAD is an AI-powered commerce and business operations platform
designed to help businesses manage customer interactions, sales,
products, payments, delivery, riders, analytics, and day-to-day trade.

## Brand

**ATIVTRAD**

### Brand Meaning

ATIVTRAD represents:

- **ATIV** — Active
- **TRAD** — Trade

The idea behind ATIVTRAD is simple:

> When a business actively sells a product or service and receives
> value in return, a trade is taking place.

ATIVTRAD is being built to make that trade easier, faster,
more intelligent, and more automated.

## Product Vision

ATIVTRAD is intended to provide businesses with a unified platform
for managing the operational journey from customer request to
completed trade.

The platform combines:

- AI-assisted customer conversations
- Product and inventory management
- Quote generation
- Payment processing
- Delivery management
- Rider management
- Invoicing
- Customer feedback
- Business analytics
- Reports
- Subscription-based feature access

## Customer Interaction

The primary customer interaction is designed around WhatsApp.

The AI acts as the conversational sales and customer-support layer.

The backend remains responsible for validation, business rules,
transactions, inventory, payments, and persistent records.

### Core Principle

> **AI communicates and assists. The backend validates and controls.
> The database records the truth.**

The AI must not independently invent or confirm:

- Product availability
- Product prices
- Delivery fees
- Payment success
- Refund completion
- Inventory changes
- OTP verification
- Delivery completion

## Core Customer Trade Flow

The intended customer journey is:

1. Customer requests a product or service.
2. AI identifies what the customer wants.
3. If a product has variants, AI asks the customer to select the
   appropriate variant instead of assuming one.
4. Backend checks product and variant availability.
5. Backend verifies available stock.
6. AI provides the verified product price.
7. Customer provides quantity.
8. Customer provides delivery details or location.
9. ATIVTRAD determines the delivery type.
10. Delivery pricing is calculated.
11. Delivery ETA is calculated where applicable.
12. A complete quote is generated.
13. Customer explicitly accepts or declines the quote.
14. If accepted, payment instructions/options are provided.
15. Payment is verified by the backend.
16. Inventory is committed after confirmed payment.
17. Final invoice is generated.
18. Customer receives a delivery OTP.
19. Local delivery proceeds through the rider workflow.
20. Delivery is completed through backend OTP verification.
21. Customer may provide feedback after delivery.

## Merchant Dashboard

Businesses use a web dashboard to manage their operations.

Core areas include:

- Dashboard
- Products
- Orders
- Customers
- Riders
- Invoices
- Reports
- Settings

The dashboard is designed to work across desktop and mobile
screen sizes.

## Business Settings

Business-specific settings include areas such as:

- Business name
- Business phone
- Business address
- State
- Geographic location
- Local delivery
- Interstate delivery
- Interstate pricing configuration
- Business operating availability

Additional settings will be added as the platform develops.

## Business Operating Modes

ATIVTRAD is designed to support three main operating states.

### Online

The business is available for normal order processing.

### Offline — Quote Only

The AI may continue assisting customers by:

- Discussing products
- Checking availability
- Collecting quantities
- Collecting delivery details
- Generating and saving quotes

Payment and active order processing are unavailable while the
business is in Quote Only mode.

When the business resumes, an older quote must be revalidated for
relevant changes such as:

- Stock
- Price
- Delivery fee
- Quote expiry

### Closed — No Orders

The business is unavailable for new order or quote processing.

## Delivery

ATIVTRAD supports two delivery classifications.

### Local

A delivery is classified as Local when the customer's state matches
the business's configured state.

Local delivery pricing is intended to use a delivery-pricing service
or provider rather than allowing the merchant to arbitrarily choose
the delivery fee.

### Interstate

A delivery is classified as Interstate when the customer's state
differs from the business's configured state.

Interstate delivery pricing is configurable according to the
business's selected pricing method.

## Payments

ATIVTRAD is designed to integrate with Paystack for payment
processing.

Each merchant should use their own payment account rather than
ATIVTRAD holding all merchant funds in one central payment account.

Payment confirmation must come from trusted backend verification
and/or payment-provider events.

A customer's statement that they have paid, including a screenshot,
must not by itself be treated as proof of payment.

## Refunds

Paid orders cancelled by the business under an allowed exceptional
cancellation process may require a refund.

Refunds should be initiated against the original payment transaction.

ATIVTRAD should not provide a normal customer-facing free-form
alternative refund-account process.

Refund status must be tracked through the payment provider rather
than assuming that a refund has completed.

## Inventory

Stock availability must be checked before a quote/payment process
continues.

The intended inventory lifecycle is:

**Available stock**
→ **Reservation**
→ **Payment confirmation**
→ **Inventory commitment**

If payment fails or a reservation expires, reserved inventory should
be released.

The system should not rely on stale stock information and then
cancel a successfully paid order because the requested stock was
never properly validated.

## Quotes

A quote contains the commercial information required for a customer
to make an informed decision.

A quote may contain:

- Products
- Variants
- Quantities
- Unit prices
- Product subtotal
- Delivery fee
- Delivery type
- Total
- Currency
- Delivery information
- Estimated delivery information
- Quote expiry

The customer must explicitly accept or decline the quote.

A declined quote does not necessarily end the conversation.
The AI may offer reasonable alternatives such as a smaller quantity
or another available variant and generate a revised quote.

## Rider Management

ATIVTRAD supports rider-based local delivery.

The planned local delivery lifecycle includes:

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

Riders may have operational states including:

- Active
- Suspended
- Blocked
- Removed

Historical records should remain available when a rider is removed
from active operations.

## OTP Delivery Verification

After payment confirmation and order confirmation, a delivery OTP
is generated and sent to the customer.

The rider receives delivery information but must not receive the
customer's OTP in advance.

The OTP is used to verify delivery completion through the backend.

## Customer Feedback

After OTP-confirmed delivery, ATIVTRAD can request customer feedback.

Feedback is intended to provide the business owner with insight into
customer satisfaction and delivery/service quality.

## Interstate Fulfillment

For interstate orders, the automated local rider-dispatch workflow
does not apply.

After payment confirmation, ATIVTRAD proceeds with the appropriate
invoice and OTP process while interstate fulfillment is handled
according to the merchant's operational process.

## Subscription Plans

ATIVTRAD is being developed as a SaaS platform.

Businesses will receive features according to their subscription plan.

Potential plan-controlled capabilities include:

- Voice product entry
- CSV/Excel product import
- Advanced analytics
- Report downloads
- Advanced AI capabilities
- Advanced delivery capabilities
- Other premium functionality

Feature restrictions must be enforced by the backend and not merely
hidden in the frontend.

## ATIVTRAD Admin

ATIVTRAD will have a separate private administration environment for
the platform owner.

The administration platform is intended to manage:

- Businesses
- Subscription plans
- Feature access
- Platform analytics
- System health
- Integrations
- Platform settings
- Feature releases
- Audit logs
- Abuse and security controls
- Administrative users

Merchant customer/order information should not be casually exposed
to platform administrators. Administrative access should follow
privacy, security, support, and legitimate operational requirements.

## Business Identity and Trust

ATIVTRAD is designed to maintain identifiable business information
for merchants.

Relevant information may include:

- Business name
- Business phone
- Business address
- State
- Latitude
- Longitude
- Place ID
- Payment configuration
- Verification information

Transaction records such as invoices should clearly identify the
business involved in the transaction.

## Product Management

Products support:

- Product name
- Category
- Base price
- Stock
- Variants
- Variant-specific price
- Variant-specific stock

Planned product-entry capabilities include:

- Manual product management
- CSV/Excel bulk import
- Voice-based product entry

AI-generated or imported product information should pass through
validation and owner confirmation before being committed to the
database.

## Technology

ATIVTRAD is currently being developed using:

- Next.js
- TypeScript
- React
- Prisma
- PostgreSQL/database-backed persistence
- API routes
- Git
- External service/provider integrations

External services should be implemented through replaceable
service/provider layers where appropriate.

## Development Method

ATIVTRAD is being developed incrementally.

The preferred development cycle is:

**Build → Test → Document → Commit**

Business rules should be established before implementing complex
workflows.

When an established business rule changes, the change should be
documented before or alongside the corresponding code change.

## Documentation Structure

Project documentation is maintained inside the `/docs` directory.

Current documentation areas include:

- Product
- Architecture
- Database
- API
- Business Rules
- Delivery
- Payments
- Riders
- Roadmap
- Changelog

Documentation is a living part of the project and should evolve
alongside the software.

## Intellectual Property

ATIVTRAD is the official product and brand name.

The underlying software, source code, original architecture, original
business logic, product designs, documentation, and other original
materials developed for ATIVTRAD are intended to remain the
intellectual property of the platform owner, subject to applicable
third-party licenses and service terms.

Merchants receive access to ATIVTRAD through their subscription or
other commercial agreement. They do not automatically receive
ownership of the underlying ATIVTRAD platform.