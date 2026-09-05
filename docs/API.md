# ATIVTRAD API Documentation

## 1. Purpose

This document describes the backend API layer used by ATIVTRAD.

The API connects the frontend, customer/AI workflows, business logic, database, delivery services, and payment services.

General flow:

```text
Frontend / AI / External Channel
              ↓
          API Route
              ↓
       Validation Layer
              ↓
       Business Services
              ↓
            Prisma
              ↓
         PostgreSQL
```

The backend API is responsible for validating requests, enforcing business rules, calling the appropriate services, and returning structured responses.

The frontend must not directly access PostgreSQL.

---

## 2. API Design Principles

ATIVTRAD APIs should follow these principles:

1. Validate all incoming data.
2. Never trust customer claims for critical business events.
3. Never allow AI to bypass backend validation.
4. Keep business logic in reusable services where appropriate.
5. Keep API routes focused on request/response handling.
6. Return clear HTTP status codes.
7. Do not expose secrets.
8. Do not expose internal database details unnecessarily.
9. Keep delivery pricing and ETA as separate concerns.
10. Use database transactions for critical financial and inventory operations.
11. Enforce business and tenant access rules on the backend.
12. Keep APIs responsive and mobile-friendly where applicable.

---

## 3. Current API Status

The API layer is under active development.

The following areas currently have API foundations:

- Business settings
- Delivery ETA
- Delivery pricing services
- Delivery location classification
- Quote creation
- Customers
- Orders
- Products and related dashboard functionality

Some existing routes were created during earlier development and require refactoring to match the final ATIVTRAD business flow.

Therefore, an API route existing in the project does not automatically mean that its final production behavior is complete.

---

## 4. Business Settings API

### GET `/api/business/settings`

Purpose:

Retrieves the current business settings.

The settings currently include information such as:

- Business name
- Phone
- Address
- State
- Latitude
- Longitude
- Place ID
- Local delivery enabled
- Interstate delivery enabled
- Interstate pricing method
- Interstate fixed fee

The response represents the current stored business settings.

---

### PUT `/api/business/settings`

Purpose:

Updates business settings.

Supported settings currently include:

```text
name
phone
address
state
latitude
longitude
placeId
localDeliveryEnabled
interstateDeliveryEnabled
interstatePricingMethod
interstateFixedFee
```

The interstate pricing method must be one of:

```text
Fixed
PerOrder
ExternalProvider
```

When `Fixed` is selected, the interstate fixed fee must be a valid non-negative integer.

The backend validates the values before saving them.

The frontend must not be trusted to enforce these rules by itself.

---

## 5. Delivery Location Classification

ATIVTRAD classifies delivery locations using the business state and customer state.

Current types:

```text
Local
Interstate
```

Current logic:

```text
Business state = Customer state
        ↓
      Local
```

```text
Business state ≠ Customer state
        ↓
    Interstate
```

State comparison is case-insensitive.

A missing business state or customer state results in a validation error.

This logic is implemented as reusable backend functionality rather than being dependent on AI.

---

## 6. Delivery Pricing Service

The delivery pricing service calculates the delivery fee.

The service accepts customer delivery information including:

```text
customerLocation
customerAddress
```

The customer location currently requires a state.

Conceptually:

```text
Customer location
       ↓
Classify Local / Interstate
       ↓
Select pricing method
       ↓
Calculate delivery fee
       ↓
Return pricing result
```

The service returns information such as:

```text
deliveryType
deliveryFee
currency
provider
providerQuoteId
expiresAt
```

---

## 7. Local Delivery Pricing

For Local delivery, ATIVTRAD uses the configured delivery pricing provider.

The business location is used as the pickup location.

The customer address is used as the drop-off location.

Conceptually:

```text
Business address
      ↓
Delivery Provider
      ↓
Customer address
```

The merchant should not arbitrarily override the provider-derived Local delivery fee through ordinary business settings.

This keeps local delivery pricing consistent with the delivery pricing architecture.

---

## 8. Interstate Delivery Pricing

Interstate delivery uses the business's configured interstate pricing method.

### Fixed

The configured fixed fee is returned.

Example:

```text
Interstate fixed fee = ₦6,000
```

### PerOrder

The service currently recognizes this configuration but the final calculation is not yet implemented.

### ExternalProvider

The service currently recognizes this configuration but the final provider implementation is not yet complete.

Unimplemented pricing methods must not silently return an incorrect delivery fee.

---

## 9. Delivery Provider Adapter

ATIVTRAD uses a provider abstraction for delivery pricing.

The purpose is to prevent the rest of the application from depending directly on one delivery company.

Current provider configuration supports:

```text
mock
travo
```

The provider can be selected through environment configuration.

Example:

```text
DELIVERY_PROVIDER=mock
```

This allows development and testing without requiring a live delivery provider.

---

## 10. Mock Delivery Provider

The mock delivery provider is intended for development and testing.

The configured mock delivery fee can be controlled through:

```text
MOCK_DELIVERY_FEE
```

The mock provider returns a delivery quote containing a provider quote ID and an expiry time.

The mock provider does not represent real-world delivery pricing.

It must not be treated as a production delivery quote.

---

## 11. Travo Delivery Provider

The current Travo adapter uses the configured Travo service for delivery quotes.

The adapter communicates with the provider using the required authentication and delivery information.

The provider response is converted into ATIVTRAD's internal delivery quote structure.

Provider-specific implementation details should remain inside the provider adapter.

The rest of ATIVTRAD should use the common delivery pricing interface instead of depending directly on Travo-specific response formats.

---

## 12. Delivery Quote Expiry

Provider delivery quotes may expire.

The API therefore supports information such as:

```text
providerQuoteId
providerQuoteExpiresAt
```

When a provider quote has expired, ATIVTRAD should obtain a fresh delivery quote rather than relying on stale pricing.

This is especially important when a customer returns to an old quote or changes their delivery address.

---

## 13. Delivery ETA API

### POST `/api/delivery-eta`

Purpose:

Calculates an estimated delivery time and related route information.

The request contains:

```text
pickupLocation
dropoffLocation
```

The response can contain:

```text
estimatedDurationMinutes
distanceKm
trafficAware
provider
```

ETA is an estimate.

It is not a guarantee of the actual delivery time.

---

## 14. ETA Provider Architecture

ETA is implemented separately from delivery pricing.

Conceptually:

```text
Delivery Pricing
       ↓
Delivery Fee
```

and:

```text
ETA Service
       ↓
Estimated Duration
```

The two services may use related location information but should remain separate so that one can change without unnecessarily changing the other.

The ETA provider is replaceable through an adapter architecture.

---

## 15. Mock ETA Provider

Development currently supports a mock ETA provider.

Relevant configuration includes:

```text
DELIVERY_ETA_PROVIDER=mock
MOCK_DELIVERY_ETA_MINUTES=35
MOCK_DELIVERY_DISTANCE_KM=15
```

The mock provider is for testing.

It does not represent live traffic information.

Any traffic-awareness value returned by the mock implementation must be treated as development/test data rather than proof of real traffic conditions.

---

## 16. Quote API — Current Implementation

### POST `/api/quote`

A quote endpoint currently exists.

The current implementation accepts information based on:

```text
productId
variantId
quantity
location
```

The current route validates:

- Product existence
- Variant existence where applicable
- Quantity
- Available stock

The current implementation calculates a product subtotal.

However, the current route is an earlier implementation and is not yet the final ATIVTRAD quote engine.

---

## 17. Quote API — Current Limitations

The current quote route has important limitations that must be addressed.

Current limitations include:

- It does not yet use the complete customer transaction flow.
- It does not yet require the final customer identity structure.
- It currently uses a hard-coded delivery fee.
- It does not yet persist the complete Quote and QuoteItem structure.
- It does not yet fully integrate delivery pricing.
- It does not yet fully integrate ETA.
- It does not yet implement final quote expiry behavior.
- It does not yet represent the final structured delivery location model.

Therefore, the current quote endpoint should be treated as a development foundation rather than the final production quote engine.

---

## 18. Final Quote API Direction

The quote API is intended to evolve toward a request containing:

```text
customerId
items
delivery location
```

A delivery location should eventually contain structured information such as:

```text
address
state
```

Additional location information such as coordinates or a validated place ID may be used when the location system is expanded.

The final quote process should be:

```text
Validate customer
        ↓
Validate products / variants
        ↓
Validate quantity and stock
        ↓
Calculate product subtotal
        ↓
Classify Local / Interstate
        ↓
Calculate delivery fee
        ↓
Calculate ETA
        ↓
Create Quote
        ↓
Create Quote Items
        ↓
Set expiry
        ↓
Return complete quote
```

---

## 19. Quote Validation

The quote API must validate all requested items.

Validation includes:

- Customer validity
- Product existence
- Variant existence when required
- Quantity validity
- Stock availability
- Price retrieval from database
- Delivery location validity
- Delivery availability
- Delivery pricing
- Quote calculation

The API must calculate prices on the backend.

The customer must not be allowed to submit an arbitrary price and have the backend accept it.

---

## 20. Quote Calculation

The backend should calculate:

```text
Item subtotal
+
Delivery fee
=
Total
```

For multiple items:

```text
Product A subtotal
+
Product B subtotal
+
Product C subtotal
+
Delivery fee
=
Quote total
```

The frontend or AI may display the calculation, but the backend must remain authoritative.

---

## 21. Customer API

### POST `/api/customers`

The customer creation route currently exists.

Its purpose is to create a customer record.

The customer API is still under development.

A successful customer creation should eventually return the created customer information and identifier required by later quote and order operations.

Customer creation must validate required customer information and must not create malformed records.

---

## 22. Customer API — Current Development Issue

The current customer API has an unresolved development issue.

A test POST request using:

```text
08000000001
```

returned an HTTP 500 response during development.

The exact server-side error must be inspected from the development server output before the issue is considered resolved.

The API must not be marked as production-ready until the underlying error is identified and fixed.

A GET request to:

```text
/api/customers
```

currently returns:

```text
405 Method Not Allowed
```

because the current route does not implement the GET method.

This is not automatically an error if the GET operation is not yet required, but it should not be assumed to exist.

---

## 23. Orders API

Order API routes currently exist for order operations.

The current implementation is an earlier development implementation and does not yet represent the final ATIVTRAD order architecture.

The existing POST order behavior accepts information including:

```text
customerId
location
items
```

The earlier implementation checks product information and performs stock changes inside a transaction.

However, it also contains development-era behavior that must be refactored.

---

## 24. Orders API — Current Limitations

The current order implementation has limitations including:

- It can deduct Product stock immediately.
- It uses a hard-coded delivery fee of ₦500.
- It creates an order using an earlier approval-oriented flow.
- It does not yet follow the final payment-confirmation-first architecture.
- It does not yet implement the complete quote-to-payment-to-order process.
- It does not yet implement final inventory reservation and commitment behavior.
- It does not yet implement final rider fulfillment.
- It does not yet implement OTP delivery confirmation.

The order API should therefore be refactored rather than treated as complete.

---

## 25. Final Order Flow

The intended final order flow is:

```text
Customer requests products
        ↓
Quote created
        ↓
Customer accepts quote
        ↓
Payment initialized
        ↓
Payment verified
        ↓
Inventory committed
        ↓
Order confirmed
        ↓
Invoice / OTP
        ↓
Fulfillment
```

The backend must control each transition.

AI should not directly create a confirmed paid order without the required backend validations.

---

## 26. Payment API Direction

Payment APIs will be added as the payment workflow is implemented.

The intended payment flow is:

```text
Accepted Quote
      ↓
Initialize Payment
      ↓
Customer Pays
      ↓
Backend Verification / Webhook
      ↓
Payment Confirmed
      ↓
Inventory Commitment
      ↓
Order Confirmation
```

Payment screenshots or customer claims must not be used as the final confirmation mechanism.

---

## 27. Payment Verification API Direction

Payment verification must happen on the server.

The backend should verify the transaction with the configured payment provider and ensure that:

- The payment reference is valid.
- The amount matches the expected amount.
- The transaction belongs to the expected payment/quote.
- The transaction has actually succeeded.
- The payment has not already been incorrectly processed.

Only after successful verification should the payment record become `Confirmed`.

---

## 28. Webhook Direction

The payment architecture is expected to support payment-provider webhooks.

Webhook handling must:

- Validate the incoming event.
- Identify the relevant transaction.
- Avoid duplicate processing.
- Update payment state safely.
- Trigger the appropriate downstream transaction process.

Webhook processing must be idempotent.

A repeated webhook must not create duplicate orders or commit inventory twice.

---

## 29. Refund API Direction

Refund functionality will be added with the cancellation and payment system.

The intended flow is:

```text
Paid Order
      ↓
Valid Cancellation
      ↓
Refund Original Transaction
      ↓
Track Refund Status
```

ATIVTRAD should normally refund the original payment transaction rather than requesting an alternative customer bank account.

The final refund API should track provider status and exceptional states such as a refund requiring attention.

---

## 30. Authentication and Authorization

API authentication and authorization will become increasingly important as ATIVTRAD moves from a single development business to a SaaS platform.

The backend must eventually determine:

- Who is making the request.
- Which business they belong to.
- What role they have.
- What resources they may access.
- Whether they may perform the requested action.

Frontend access restrictions alone are not sufficient.

---

## 31. Multi-Tenant API Protection

When multiple businesses are onboarded, API requests must be scoped to the correct business/tenant.

Conceptually:

```text
Authenticated User
        ↓
Business Membership
        ↓
Business / Tenant
        ↓
Requested Resource
```

A user from Business A must not be able to request or modify Business B's products, customers, orders, riders, or other private data.

Tenant checks must happen on the backend.

---

## 32. API Validation

Every API endpoint must validate incoming data.

Validation should cover:

- Required fields
- Data types
- Allowed values
- Numeric ranges
- IDs
- Relationships
- Business ownership
- Permissions
- Business rules

Invalid input should return an appropriate client error rather than causing an unexpected server failure.

---

## 33. Error Handling

ATIVTRAD APIs should return predictable HTTP responses.

General direction:

```text
200
Successful request

201
Resource successfully created

400
Invalid request or business input

401
Authentication required

403
Authenticated but not authorized

404
Resource not found

405
HTTP method not supported by the route

409
Conflict

422
Valid request format but business validation failed

500
Unexpected server error
```

The exact status code should reflect the actual situation.

Internal stack traces, secrets, database credentials, and unnecessary implementation details must not be exposed to customers.

---

## 34. API Response Design

API responses should be structured consistently.

Successful responses should provide the information required by the caller without exposing unnecessary internal details.

Error responses should provide a safe, understandable error message and, where appropriate, a stable error code.

Example:

```json
{
  "error": "LOCATION_STATE_REQUIRED"
}
```

Stable error codes make frontend and integration handling more reliable than depending only on human-readable messages.

---

## 35. API and AI Boundary

AI may request information through backend APIs, but AI does not bypass the API's validation.

Example:

```text
Customer asks:
"Do you have 20 Full Chickens?"
        ↓
AI requests backend product information
        ↓
Backend checks database
        ↓
Backend returns actual stock
        ↓
AI communicates result
```

The AI should not invent the answer.

The same principle applies to:

- Prices
- Delivery fees
- ETA
- Payment status
- Order status
- Refund status
- Inventory
- Business availability

---

## 36. API and Frontend Boundary

The frontend dashboard communicates with backend APIs.

The frontend should not:

- Connect directly to PostgreSQL.
- Decide payment confirmation.
- Decide final stock availability.
- Bypass business rules.
- Trust client-supplied totals.
- Perform privileged administrative actions without backend authorization.

The backend remains authoritative.

---

## 37. API and Database Transactions

API routes that perform critical multi-step operations should use database transactions through Prisma.

Examples include:

```text
Payment confirmed
        ↓
Inventory updated
        ↓
Order created
```

and:

```text
Order cancelled
        ↓
Refund record created
        ↓
Order status updated
```

The exact transaction boundaries will be defined as these features are implemented.

---

## 38. API Security

API security requirements include:

- Never expose secret keys to the client.
- Validate request bodies.
- Validate resource ownership.
- Authenticate privileged operations.
- Authorize business-specific operations.
- Protect payment operations.
- Protect customer information.
- Avoid leaking database implementation details.
- Log security-sensitive operations where appropriate.
- Enforce tenant isolation.

---

## 39. API Environment Configuration

External integrations should be configured through environment variables.

Current development configuration includes values such as:

```text
DELIVERY_PROVIDER
TRAVO_SECRET_KEY
MOCK_DELIVERY_FEE
DELIVERY_ETA_PROVIDER
MOCK_DELIVERY_ETA_MINUTES
MOCK_DELIVERY_DISTANCE_KM
```

Secrets must not be committed to source control.

Development mock values must not be mistaken for production provider configuration.

---

## 40. API Testing

Each API should be tested independently before being connected to the frontend.

Testing should cover:

- Successful requests
- Missing fields
- Invalid IDs
- Invalid quantities
- Insufficient stock
- Invalid delivery locations
- Local delivery
- Interstate delivery
- Provider errors
- Expired quotes
- Payment failures
- Duplicate webhook events
- Unauthorized access
- Tenant isolation
- Database transaction failures

API tests should verify both status codes and returned data.

---

## 41. Current Known API Development Issues

The following known areas require further work:

### Customers

The current customer POST test returns HTTP 500 and requires server-side diagnosis.

### Quote

The existing quote route is an earlier implementation with a hard-coded delivery fee and does not yet persist the final quote structure.

### Orders

The existing order route uses earlier stock deduction and delivery-fee behavior and must be refactored around the final quote/payment architecture.

### ETA

The mock ETA provider is for development and should not be interpreted as real traffic data.

### Delivery Pricing

Interstate `PerOrder` and `ExternalProvider` modes are configured but not yet fully implemented.

These issues are documented so they are not accidentally treated as completed functionality.

---

## 42. API Development Workflow

API development follows the ATIVTRAD development cycle:

```text
Define requirement
       ↓
Design request/response
       ↓
Implement backend
       ↓
Validate business rules
       ↓
Test API
       ↓
Connect frontend
       ↓
Test frontend + API
       ↓
Document
       ↓
Commit
```

A backend capability should be tested before relying on it in the frontend.

---

## 43. Planned API Areas

As ATIVTRAD develops, additional API capabilities will include:

```text
Customers
Products
Variants
Quotes
Quote Acceptance
Payments
Payment Verification
Webhooks
Orders
Cancellations
Refunds
Invoices
OTP
Riders
Rider Assignments
Deliveries
Feedback
Business Availability
Operating Hours
Bulk Product Import
Voice Product Import
Reports
Analytics
Subscriptions
Entitlements
Admin
Audit Logs
```

These are planned areas and should not be considered implemented merely because they appear in this documentation.

---

## 44. API Source of Truth

The actual API route implementation in the ATIVTRAD codebase is the technical source of truth for what currently exists.

`API.md` documents the current implementation, limitations, and intended evolution.

Therefore:

```text
API Route Code
      ↓
Actual API behavior

API.md
      ↓
Human-readable API documentation
```

When an API changes, this document should eventually be updated.

---

## 45. Final Principle

ATIVTRAD APIs are the controlled gateway between the application and the business data.

The API must ensure that:

```text
Customer / AI / Frontend
          ↓
        API
          ↓
      Validation
          ↓
    Business Rules
          ↓
       Database
```

The API must never allow an untrusted client, customer message, screenshot, or AI response to bypass the backend's business rules.

The goal is to build each API capability gradually, test it thoroughly, connect it to the appropriate interface, document it, and then move to the next feature.
