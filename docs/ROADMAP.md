# ATIVTRAD — Development Roadmap

## 1. Purpose

This roadmap defines the development direction for ATIVTRAD.

It is intentionally flexible.

ATIVTRAD will be developed feature-by-feature:

1. Build
2. Test
3. Connect
4. Test again
5. Document the actual implementation
6. Commit stable changes

The roadmap may change as development reveals new technical requirements or business rules.

---

# 2. Development Philosophy

ATIVTRAD is being built around one core principle:

> AI communicates and assists. Backend validates and controls. Database records truth.

The system should therefore be developed from the backend and business logic outward.

Core business capabilities must work correctly before the product is optimized visually or expanded with advanced features.

---

# 3. NOW — Core Commerce Engine

These are the immediate priorities.

## 3.1 Customer System

- Fix customer creation API
- Validate customer information
- Establish reliable customer records
- Connect customers to quotes and orders
- Test customer creation and retrieval

### Status

- Customer model exists
- Customer creation endpoint exists
- Customer creation currently has a 500 error requiring diagnosis

---

## 3.2 Quote Engine

Build the proper production quote flow.

### Requirements

- Validate customer
- Validate product
- Validate variant
- Validate quantity
- Validate stock
- Capture structured delivery location
- Classify Local vs Interstate
- Calculate delivery pricing
- Calculate delivery ETA
- Calculate subtotal
- Calculate delivery fee
- Calculate total
- Store quote
- Store quote items
- Store delivery information
- Store ETA information
- Set quote expiry
- Return a complete quote

### Important

The quote must represent the actual commercial offer given to the customer.

Prices, stock, delivery fee and totals must come from backend-controlled data.

---

## 3.3 Quote Lifecycle

Implement:

```text
Draft
  ↓
Ready
  ↓
Accepted
  ↓
Payment
  ↓
Order
```

Alternative paths:

```text
Ready → Declined
Ready → Expired
Ready → Cancelled
```

The system must correctly handle expired and declined quotes.

---

## 3.4 Business Availability

Implement the business operating state:

```text
Online
Offline — Quote Only
Closed — No Orders
```

Add:

- Operating hours
- Weekly schedule
- Temporary/emergency offline mode
- Quote-only behaviour
- Revalidation when returning online

---

# 4. NEXT — Payment & Order Confirmation

After the quote engine is stable:

## 4.1 Quote Acceptance

- Customer explicitly accepts quote
- Validate quote again
- Validate stock again
- Validate quote expiry
- Prepare payment

---

## 4.2 Paystack Integration

Implement:

- Payment initialization
- Payment reference
- Server-side payment verification
- Paystack webhook handling
- Payment status management
- Failed payment handling
- Duplicate payment protection

The AI must never treat a customer message or screenshot as proof of payment.

---

## 4.3 Inventory Reservation

Implement transactional inventory handling:

```text
Quote Accepted
      ↓
Stock Validated
      ↓
Stock Reserved
      ↓
Payment
      ↓
Payment Confirmed
      ↓
Inventory Committed
```

Failed or expired payments must release reservations.

Concurrency must be handled so that two customers cannot successfully purchase the same stock.

---

## 4.4 Order Creation

After confirmed payment:

- Create order
- Link order to customer
- Link order to quote
- Record purchased items
- Record final prices
- Record delivery information
- Record payment information
- Commit inventory
- Generate order confirmation

---

# 5. NEXT — Invoice, OTP & Fulfillment

## 5.1 Invoice

Create the final invoice containing:

- Business identity
- Business phone
- Business address
- Customer information
- Products
- Quantities
- Prices
- Delivery fee
- Total
- Order reference
- Payment status

---

## 5.2 OTP

Implement secure delivery confirmation OTP.

Flow:

```text
Paid Order
   ↓
OTP Generated
   ↓
Customer Receives OTP
   ↓
Rider Delivers
   ↓
Rider Requests OTP
   ↓
Backend Verifies OTP
   ↓
Order Delivered
```

The rider must not receive the OTP before delivery.

---

# 6. NEXT — Local Rider Fulfillment

Implement the local rider lifecycle:

```text
Confirmed
    ↓
Finding Rider
    ↓
Rider Assigned
    ↓
Rider Accepted
    ↓
Going to Business
    ↓
Arrived at Business
    ↓
Order Picked Up
    ↓
Out for Delivery
    ↓
Arrived at Customer
    ↓
OTP Verification
    ↓
Delivered
    ↓
Feedback
```

Implement:

- Rider eligibility
- Automatic assignment
- Rider acceptance
- Pickup confirmation
- Delivery status
- OTP verification
- Rider availability after delivery
- Rider suspension/blocking/removal

---

# 7. NEXT — Interstate Fulfillment

For interstate orders:

- Classify destination
- Calculate interstate delivery fee
- Generate ETA where available
- Accept payment
- Confirm order
- Generate invoice
- Generate OTP
- Stop automatic local rider dispatch
- Allow business owner to handle fulfillment

Interstate pricing methods:

```text
Fixed
PerOrder
ExternalProvider
```

---

# 8. NEXT — Order Management

Merchant dashboard capabilities:

- View orders
- View order details
- View customer
- View payment status
- View fulfillment status
- Hold order
- Resume order
- Cancel order
- Record cancellation reason
- View refund status
- View delivery status

Hold and cancellation actions must be controlled and auditable.

---

# 9. NEXT — Refund System

Implement controlled refunds.

Primary rule:

> Refunds return to the original payment transaction.

Implement:

- Refund request
- Original transaction reference
- Full refund
- Partial refund where supported
- Refund status
- Paystack integration
- Refund failure handling
- Refund audit trail

---

# 10. LATER — Product Management & Productivity

## 10.1 Product Management

Improve:

- Product creation
- Variant management
- Pricing
- Stock management
- Categories
- Product activation/deactivation

---

## 10.2 Bulk Product Import

Support:

- CSV
- Excel

Flow:

```text
Upload
  ↓
Parse
  ↓
Validate
  ↓
Preview
  ↓
Owner Confirmation
  ↓
Publish
```

Invalid data must not be silently published.

---

## 10.3 Voice Product Import

Allow merchants to describe products using voice.

Flow:

```text
Voice
  ↓
Speech-to-Text
  ↓
AI Extraction
  ↓
Validation
  ↓
Preview
  ↓
Owner Confirmation
  ↓
Publish
```

Voice and spreadsheet imports should eventually use the same validation pipeline.

---

# 11. LATER — Customer Experience

Improve the customer experience across the complete purchase journey.

Areas include:

- Better AI product discovery
- Variant clarification
- Quantity clarification
- Delivery-location collection
- Quote presentation
- Alternative recommendations
- Quote acceptance
- Payment guidance
- Order updates
- Delivery updates
- Feedback collection
- Customer history

The AI must remain grounded in backend data.

---

# 12. LATER — Maps & Location Intelligence

Implement stronger location handling.

Support:

- Address search
- GPS location
- Map marker
- Drag-to-adjust location
- Place ID
- Latitude/longitude
- State validation
- Business location validation
- Customer location validation

The system must avoid relying on hallucinated landmarks or unverified locations.

---

# 13. LATER — Analytics & Reporting

Merchant analytics:

- Sales
- Orders
- Revenue
- Products
- Stock
- Customers
- Delivery performance
- Rider performance
- Cancellation rate
- Refunds

Reporting features can include:

- Dashboard reports
- Exportable reports
- Date filtering
- Product reports
- Customer reports
- Order reports

Advanced reporting can become a subscription feature.

---

# 14. LATER — SaaS Subscription System

Implement ATIVTRAD as a multi-tenant SaaS platform.

Core components:

- Business accounts
- Tenant isolation
- Subscription plans
- Plan status
- Feature entitlements
- Usage limits
- Billing
- Subscription upgrades
- Subscription downgrades
- Subscription cancellation

Backend must enforce feature access.

The frontend should not be the security boundary.

---

# 15. FUTURE — ATIVTRAD Admin

Create a separate administrative platform for ATIVTRAD.

Capabilities may include:

- Business management
- Subscription management
- Plan management
- Feature management
- Platform analytics
- System health
- Integration management
- Abuse monitoring
- Support tools
- Feature flags
- Platform configuration
- Audit logs
- Admin user management

ATIVTRAD Admin must remain separate from merchant operations.

---

# 16. FUTURE — Advanced Platform Capabilities

Potential future capabilities include:

- Advanced AI sales assistance
- Automated customer follow-up
- Intelligent product recommendations
- Advanced delivery optimization
- Automated business insights
- More delivery providers
- More payment providers
- Additional communication channels
- Advanced fraud detection
- More sophisticated inventory management
- Business automation

These features should only be introduced after the core commerce engine is reliable.

---

# 17. Technical Priority Order

The practical development order is:

```text
Customer
   ↓
Quote Engine
   ↓
Business Availability
   ↓
Quote Acceptance
   ↓
Payment
   ↓
Inventory
   ↓
Order
   ↓
Invoice
   ↓
OTP
   ↓
Local Fulfillment
   ↓
Interstate Fulfillment
   ↓
Refunds
   ↓
Product Productivity
   ↓
Maps
   ↓
Analytics
   ↓
SaaS
   ↓
ATIVTRAD Admin
   ↓
Advanced Automation
```

---

# 18. Testing Strategy

Every major feature follows:

```text
Build
  ↓
Backend Test
  ↓
Fix
  ↓
Frontend Integration
  ↓
Full Flow Test
  ↓
Edge Cases
  ↓
Document
  ↓
Commit
```

Testing must include both successful and failure scenarios.

Examples:

- Invalid customer
- Invalid product
- Invalid variant
- Insufficient stock
- Invalid location
- Delivery provider failure
- ETA provider failure
- Expired quote
- Declined quote
- Failed payment
- Duplicate payment
- Concurrent stock purchase
- Cancellation
- Refund failure
- Invalid OTP

---

# 19. Documentation Strategy

Documentation is a living part of development.

The main documents are:

```text
README.md
PRODUCT.md
ARCHITECTURE.md
DATABASE.md
API.md
DELIVERY.md
PAYMENTS.md
RIDERS.md
BUSINESS-RULES.md
ROADMAP.md
CHANGELOG.md
```

Documentation should describe the actual implementation.

When a feature changes:

```text
Code changes
     ↓
Tests
     ↓
Documentation update
```

No document should be treated as permanently frozen.

---

# 20. Current Development Position

ATIVTRAD currently has established foundations for:

- Product data
- Product variants
- Inventory
- Customers
- Quotes
- Delivery classification
- Delivery pricing
- Delivery ETA
- Business settings
- Payment data model
- Order data model
- Rider direction
- Feedback direction
- Refund direction
- Subscription direction
- Core business rules
- System architecture

The immediate implementation priority is:

### 1. Fix Customer API

Resolve the current customer creation `500` error.

### 2. Rebuild Quote Engine

Replace the temporary quote implementation with the proper persisted quote flow.

### 3. Test Complete Quote Creation

Test:

- Customer
- Product
- Variant
- Quantity
- Stock
- Location
- Delivery classification
- Delivery fee
- ETA
- Total
- Quote persistence
- Quote expiry

Only after this is stable should the next major feature begin.

---

# 21. Roadmap Principle

The roadmap is a direction, not a prison.

ATIVTRAD should not move to the next major system simply because the roadmap says so.

A feature is considered ready to move forward when:

- The business rule is clear
- The backend works
- The database is correct
- Tests pass
- The frontend integration works where applicable
- Edge cases are handled
- Documentation reflects reality

Then we move forward.

---

# 22. Final Development Principle

Build the foundation first.

Make the transaction reliable.

Make the data truthful.

Make the customer experience simple.

Then scale the platform.

> **ATIVTRAD — Active Trade, built around real transactions.**
