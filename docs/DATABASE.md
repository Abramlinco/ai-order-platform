# ATIVTRAD Database Documentation

## 1. Purpose

This document describes the database structure used by ATIVTRAD.

The database stores the persistent information required to operate businesses, products, customers, quotes, payments, orders, riders, delivery operations, and other platform functionality.

The database is managed through Prisma migrations.

The database is the persistent source of truth for ATIVTRAD business data.

Core principle:

> AI communicates and assists. Backend validates and controls. Database records truth.

---

## 2. Database Technology

ATIVTRAD currently uses:

- Prisma ORM
- PostgreSQL
- Prisma migrations
- Generated Prisma Client

General data flow:

```text
ATIVTRAD Application
        ↓
      Prisma
        ↓
   PostgreSQL
```

Database schema changes must be introduced through Prisma migrations rather than manually modifying the production database.

---

## 3. Core Data Model

The core business relationship is conceptually:

```text
Business
    ↓
Products
    ↓
Product Variants
```

The customer transaction relationship is:

```text
Business
    ↓
Customers
    ↓
Quotes
    ↓
Quote Items
    ↓
Payment
    ↓
Order
    ↓
Delivery / Rider
    ↓
Feedback
```

The exact relational structure will continue to evolve as additional features are implemented.

Planned structures should only be added to the actual database when their corresponding features are implemented.

---

## 4. Business

The `Business` model represents a merchant or business using ATIVTRAD.

Current model:

```prisma
model Business {
  id String @id @default(uuid())
  name String
  phone String?
  address String?
  state String?
  latitude Float?
  longitude Float?
  placeId String?
  localDeliveryEnabled Boolean @default(true)
  interstateDeliveryEnabled Boolean @default(false)
  interstatePricingMethod InterstatePricingMethod @default(Fixed)
  interstateFixedFee Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

The record stores business identity, location, delivery settings, and timestamps.

---

## 5. Interstate Pricing Method

ATIVTRAD supports three interstate pricing methods:

```prisma
enum InterstatePricingMethod {
  Fixed
  PerOrder
  ExternalProvider
}
```

`Fixed` uses a configured fee. `PerOrder` is reserved for future order-based calculation. `ExternalProvider` is reserved for future provider-based calculation.

---

## 6. Products

The `Product` model stores products sold by a business.

```prisma
model Product {
  id String @id @default(uuid())
  name String
  category String
  price Int
  stock Int @default(0)
  orderItems OrderItem[]
  variants ProductVariant[]
  quoteItems QuoteItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

The backend must retrieve product information from the database. AI must not invent product names, prices, or stock levels.

---

## 7. Product Variants

A product can have variants such as sizes, quantities, or configurations.

```prisma
model ProductVariant {
  id String @id @default(uuid())
  productId String
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name String
  price Int
  stock Int @default(0)
  orderItems OrderItem[]
  quoteItems QuoteItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([productId])
}
```

Each variant belongs to a parent product and may have its own price and stock.

---

## 8. Customers

Customers represent people who interact with a business through ATIVTRAD.

The customer system is being developed to store customer identity, phone number, location information, quote history, order history, feedback, and timestamps.

The exact customer schema is still evolving.

Customer records must eventually be associated with the correct business as ATIVTRAD becomes a multi-tenant SaaS platform.

---

## 9. Inventory

Inventory represents the quantity of products available for sale.

For products without variants, stock may be represented by `Product.stock`. For products with variants, specific stock should be represented by `ProductVariant.stock`.

The backend must reject requests exceeding available stock.

Inventory must not be permanently reduced merely because a customer asks about a product.

---

## 10. Product and Variant Pricing

ATIVTRAD must use the actual price stored in the database.

The backend determines the applicable product or variant price. AI must not invent or modify prices.

Historical transaction prices must be preserved so that changing a current product price does not alter old quotes or completed transactions.

---

## 11. Quotes

A quote represents a proposed transaction before payment.

Current model:

```prisma
model Quote {
  id String @id @default(uuid())
  customerId String
  customer Customer @relation(fields: [customerId], references: [id])
  subtotal Int
  deliveryFee Int
  total Int
  currency String @default("NGN")
  location String
  deliveryType DeliveryType
  deliveryProvider String?
  providerQuoteId String?
  providerQuoteExpiresAt DateTime?
  estimatedDurationMinutes Int?
  distanceKm Float?
  trafficAware Boolean?
  status QuoteStatus @default(Draft)
  expiresAt DateTime?
  items QuoteItem[]
  payment Payment?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([customerId])
  @@index([status])
  @@index([createdAt])
}
```

A quote stores customer, pricing, delivery, ETA, status, expiry, items, and payment relationship information.

---

## 12. Quote Status

Current quote statuses:

```prisma
enum QuoteStatus {
  Draft
  Ready
  Accepted
  Declined
  Expired
  Cancelled
}
```

`Draft` means being prepared. `Ready` means presentable to the customer. `Accepted` means accepted by the customer. `Declined` means declined. `Expired` means no longer valid. `Cancelled` means cancelled.

---

## 13. Quote Items

A quote can contain one or more products.

```prisma
model QuoteItem {
  id String @id @default(uuid())
  quoteId String
  quote Quote @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  productId String?
  product Product? @relation(fields: [productId], references: [id])
  variantId String?
  variant ProductVariant? @relation(fields: [variantId], references: [id])
  productName String
  variantName String?
  quantity Int
  unitPrice Int
  subtotal Int
  createdAt DateTime @default(now())
  @@index([quoteId])
  @@index([productId])
  @@index([variantId])
}
```

A quote item records the product, variant, quantity, unit price, and subtotal.

---

## 14. Historical Quote Accuracy

Quote items preserve the product and pricing information used when a quote was created.

If a product changes from ₦3,500 to ₦4,000, an existing historical quote should retain ₦3,500.

Historical quotes should preserve product name, variant name, quantity, unit price, and subtotal.

---

## 15. Delivery Type

ATIVTRAD uses:

```prisma
enum DeliveryType {
  Local
  Interstate
}
```

Local means the customer state matches the business state. Interstate means the states differ. State comparison is case-insensitive.

---

## 16. Delivery Pricing Data

Quotes can store delivery pricing information including `deliveryFee`, `deliveryProvider`, `providerQuoteId`, and `providerQuoteExpiresAt`.

Delivery pricing is separate from product pricing.

---

## 17. Delivery ETA Data

Quotes can store `estimatedDurationMinutes`, `distanceKm`, and `trafficAware`.

ETA is an estimate, not a guaranteed delivery time. Pricing and ETA are separate services.

---

## 18. Payments

The `Payment` model records payment information associated with a quote.

```prisma
model Payment {
  id String @id @default(uuid())
  quoteId String @unique
  quote Quote @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  amount Int
  status PaymentStatus @default(Pending)
  reference String?
  confirmedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

A payment contains the quote, amount, status, provider reference, confirmation time, and timestamps.

---

## 19. Payment Status

Current payment statuses:

```prisma
enum PaymentStatus {
  Pending
  Confirmed
  Failed
  Refunded
}
```

`Pending` means not yet confirmed. `Confirmed` means backend verification succeeded. `Failed` means payment failed or could not be confirmed. `Refunded` means the payment has been refunded.

---

## 20. Payment Verification

ATIVTRAD must never treat a customer message or screenshot as proof of payment.

The backend must verify payment through the configured payment system.

Only confirmed payment status should trigger the next transaction stage.

---

## 21. Orders

An order represents the actual transaction after the customer accepts the quote and payment is successfully confirmed.

The order system is still being developed and will evolve as payment, inventory, rider dispatch, OTP, and fulfillment are implemented.

Expected states include Awaiting Payment, Paid, Confirmed, Finding Rider, Rider Assigned, Picked Up, Out for Delivery, Arrived, Delivered, Held, and Cancelled.

---

## 22. Inventory and Orders

Inventory must not be permanently committed simply because a customer requests a product.

Intended flow:

```text
Customer requests product
        ↓
Check stock
        ↓
Create quote
        ↓
Customer accepts
        ↓
Payment
        ↓
Backend verifies payment
        ↓
Commit inventory
        ↓
Order confirmed
```

Inventory operations must use safe database transactions to prevent incorrect stock levels.

---

## 23. Riders

Riders are delivery personnel used for local fulfillment.

The rider system will store identity, contact information, availability, current status, assignments, delivery history, and relevant reasons/audit information.

Planned rider states are `Active`, `Suspended`, `Blocked`, and `Removed`.

The rider system is still evolving.

---

## 24. Rider Delivery Lifecycle

The intended local delivery lifecycle is:

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

The database will eventually record important state transitions and delivery information.

---

## 25. OTP

OTP is used to confirm delivery.

```text
Order confirmed
      ↓
OTP generated
      ↓
OTP securely delivered to customer
      ↓
Rider delivers order
      ↓
Customer provides OTP
      ↓
Backend verifies OTP
      ↓
Order becomes Delivered
```

The rider must not receive the customer's OTP in advance. The final OTP database model will be introduced when the feature is implemented.

---

## 26. Feedback

After successful delivery, the customer can provide feedback.

Feedback will eventually be associated with the customer, order, business, and rider/delivery where appropriate, and may contain rating, comment, and date/time.

The final feedback schema will be implemented when the feature is built.

---

## 27. Refunds

Refunds are part of the payment and order lifecycle.

```text
Paid Order
    ↓
Valid cancellation/refund condition
    ↓
Refund through original payment transaction
```

ATIVTRAD should not normally require an alternative bank account for a refund.

A future refund model may track original payment, refund amount, status, provider reference, reason, timestamps, and failure/attention status.

---

## 28. Business Operating Settings

The database will eventually store operating settings such as Online status, Quote Only mode, Closed mode, operating hours, temporary closure, and emergency offline mode.

Intended modes:

```text
Online
Offline — Quote Only
Closed — No Orders
```

These settings must be enforced by the backend.

---

## 29. Multi-Tenant Architecture

ATIVTRAD is intended to become a SaaS platform used by multiple businesses.

Each business's data must eventually be isolated.

```text
ATIVTRAD
   │
   ├── Business A
   │     ├── Products
   │     ├── Customers
   │     ├── Quotes
   │     ├── Orders
   │     └── Riders
   │
   ├── Business B
   │     ├── Products
   │     ├── Customers
   │     ├── Quotes
   │     ├── Orders
   │     └── Riders
   │
   └── Business C
         ├── Products
         ├── Customers
         ├── Quotes
         ├── Orders
         └── Riders
```

A business must never access another business's private data.

Proper tenant isolation must be completed before real merchant onboarding.

---

## 30. Database Relationships

Important relationships include:

```text
Business
   │
   ├── Products
   │      └── Product Variants
   │
   ├── Customers
   │      └── Quotes
   │             └── Quote Items
   │
   ├── Orders
   │      └── Riders
   │
   └── Business Settings
```

Transaction relationship:

```text
Customer
   ↓
Quote
   ↓
Quote Items
   ↓
Payment
   ↓
Order
   ↓
Delivery / Rider
   ↓
Feedback
```

---

## 31. Database Indexes

Indexes help the database find records efficiently.

Current indexes include customer, status, createdAt, productId, quoteId, and variantId indexes where defined in the Prisma schema.

Indexes should be added where they provide meaningful performance benefits and should not be added blindly.

---

## 32. Database Transactions

Important financial and inventory operations must use database transactions.

Example:

```text
Verify payment
      ↓
Commit inventory
      ↓
Create/update order
      ↓
Complete transaction
```

If a critical step fails, the transaction should prevent the database from being left in an invalid partial state.

---

## 33. Data Integrity

The database and backend should protect against invalid data wherever practical.

Examples:

- Quantity should not be negative.
- Prices should not be negative.
- Stock should not become negative.
- Required relationships should exist.
- Payment amounts should be valid.
- Quote totals must be calculated correctly.
- Product variants must belong to valid products.
- Quotes must reference valid customers.
- Payments must reference valid quotes.

Application-level validation and database-level constraints should work together.

---

## 34. Sensitive Data

Sensitive information must be protected.

Examples include payment credentials, API secrets, provider secret keys, authentication credentials, customer private information, refund information, and security settings.

Secrets should not be stored in ordinary product or customer records.

Environment variables and secure secret-management mechanisms should be used where appropriate.

---

## 35. Audit Logs

Important administrative and business actions should eventually be recorded.

Examples:

```text
Business settings changed
Payment account changed
Refund initiated
Order cancelled
Order held
Rider suspended
Rider blocked
Product price changed
Product stock changed
Subscription changed
Admin action performed
```

An audit log system will be added as the platform becomes more mature.

---

## 36. Subscription and Plan Data

ATIVTRAD will eventually support subscription plans.

Plans may control features such as:

- Voice product import
- Excel/CSV import
- Advanced analytics
- Report downloads
- Other premium features

The backend must enforce plan entitlements. Frontend hiding alone is not sufficient for security.

---

## 37. Future Database Models

Potential future models include:

```text
BusinessUser
BusinessMembership
OperatingHours
BusinessAvailability
Order
OrderItem
Rider
RiderAssignment
Delivery
OTP
Feedback
Refund
AuditLog
Subscription
Plan
Entitlement
Notification
WhatsAppConversation
AdminUser
PlatformSettings
FeatureFlag
```

These should be added only when the corresponding features are implemented.

A model listed here is not necessarily an existing database model.

---

## 38. Migration Policy

Database changes must be made through Prisma migrations.

General process:

```text
Change Prisma schema
        ↓
Create migration
        ↓
Apply migration
        ↓
Generate Prisma Client
        ↓
Test database
        ↓
Test application
```

Existing data must be considered before destructive schema changes.

---

## 39. Test Data

Development and test data may be used while building ATIVTRAD.

Examples include test businesses, products, variants, customers, quotes, and payments.

Test data must not be confused with real merchant or customer data.

Production systems should not depend on development test records.

---

## 40. Database Security

Database access must be restricted to authorized application services and administrators.

Important principles:

- Do not expose database credentials to the frontend.
- Do not expose Prisma directly to customers.
- Validate incoming data.
- Protect sensitive records.
- Enforce tenant isolation.
- Use secure environment variables for credentials.
- Log important security-sensitive actions.
- Avoid unnecessary storage of sensitive information.

The frontend must communicate with the backend API rather than directly accessing PostgreSQL.

---

## 41. Current Database Status

The database is currently under active development.

Implemented schema foundations include:

- Business
- Product
- ProductVariant
- Quote
- QuoteItem
- Payment
- DeliveryType
- InterstatePricingMethod

Other areas are still being developed:

- Customer improvements
- Order lifecycle
- Inventory reservation and commitment
- Riders
- OTP
- Feedback
- Refunds
- Operating hours
- Multi-tenancy
- Subscriptions
- Audit logs
- Admin architecture

This documentation distinguishes between implemented structures and planned structures.

---

## 42. Database Source of Truth

The Prisma schema is the technical source of truth for the current database structure.

`DATABASE.md` is the human-readable documentation of that structure.

```text
schema.prisma
      ↓
Actual database structure

DATABASE.md
      ↓
Human-readable explanation
```

If the Prisma schema changes, the relevant database documentation should eventually be updated.

---

## 43. Final Principle

ATIVTRAD's database is the foundation that allows the platform to reliably manage:

```text
Products
   ↓
Stock
   ↓
Customers
   ↓
Quotes
   ↓
Payments
   ↓
Orders
   ↓
Delivery
   ↓
Feedback
```

The database must preserve the truth of what happened.

AI may communicate with customers and assist with workflows, but the backend and database determine what is actually valid.

The goal is to build the database gradually, safely, and according to real ATIVTRAD business requirements.

Build only what is needed for the current feature, test it, document it, and then move to the next feature.
