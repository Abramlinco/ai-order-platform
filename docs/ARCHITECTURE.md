# ATIVTRAD Technical Architecture

## 1. Purpose

This document describes the technical structure of ATIVTRAD and how
the major components interact.

ATIVTRAD is being developed as a web-based SaaS platform with a
backend responsible for business rules, data validation,
transactions, and integrations.

The architecture is designed to allow the platform to grow from the
current development environment into a multi-tenant SaaS platform.

---

## 2. High-Level Architecture

The current conceptual architecture is:

Customer
    ↓
WhatsApp / Conversational Interface
    ↓
AI Conversation Layer
    ↓
ATIVTRAD Backend / API
    ↓
Business Services
    ↓
Prisma
    ↓
Database

External services are connected through dedicated service/provider
layers.

Examples include:

- Payment providers
- Delivery providers
- ETA/routing providers
- Messaging providers
- AI services

---

## 3. Main Application Layers

ATIVTRAD can be understood as several logical layers.

### Layer 1 — User Interfaces

Interfaces used by different users.

#### Customer

Primary interaction:

- WhatsApp

#### Merchant

Primary interaction:

- Web dashboard

#### Rider

Primary interaction:

- Rider interface/application

#### Platform Administrator

Primary interaction:

- ATIVTRAD Admin

Each interface should expose only the functionality appropriate to
its user and permissions.

---

## 4. Merchant Dashboard

The merchant dashboard provides business owners with operational
controls.

Current/planned areas include:

- Dashboard
- Products
- Orders
- Customers
- Riders
- Invoices
- Reports
- Settings

The dashboard is responsive and intended to work across desktop and
mobile devices.

The merchant dashboard should communicate with backend APIs rather
than directly manipulating the database.

---

## 5. ATIVTRAD Admin

ATIVTRAD Admin is a separate platform-level administrative interface.

It is distinct from the merchant dashboard.

Its intended responsibilities include:

- Business management
- Subscription management
- Plan management
- Feature entitlements
- Platform analytics
- System health
- Integration monitoring
- Platform settings
- Feature releases
- Audit logs
- Abuse/security management
- Administrative users

The administrator layer operates above individual businesses.

---

## 6. Customer Conversation Layer

The customer-facing AI layer is responsible for conversational
interaction.

It should:

- Understand customer requests
- Ask clarification questions
- Collect required information
- Communicate backend-verified information
- Present quotes
- Communicate payment instructions
- Communicate order status
- Communicate delivery status
- Request feedback

The AI should not directly become the source of truth for
transactional information.

---

## 7. Backend API

The backend API is the main control layer between user interfaces,
business services, external services, and persistent data.

The API is responsible for:

- Request validation
- Authentication/authorization
- Business rules
- Data validation
- Transaction coordination
- External-service communication
- Error handling
- Persistent data operations

The frontend should not be trusted to enforce security or business
rules by itself.

---

## 8. Business Services

Complex business functionality should be implemented as reusable
services rather than placing all logic directly inside route handlers.

Current/planned service areas include:

- Product service
- Customer service
- Quote service
- Inventory service
- Delivery classification service
- Delivery pricing service
- Delivery ETA service
- Payment service
- Refund service
- Order service
- Rider service
- Notification service
- Subscription/entitlement service
- Reporting/analytics service

Services should contain reusable business logic where practical.

---

## 9. Product and Inventory Architecture

Products can contain variants.

Conceptually:

Product
    ↓
Product Variant
    ↓
Price + Stock

Example:

Chicken
    ├── Full Chicken
    ├── Half Chicken
    ├── Legs
    └── Wings

The backend validates product/variant relationships and stock.

Inventory operations should eventually support safe reservation and
commitment.

Intended lifecycle:

Available
    ↓
Reserved
    ↓
Payment Confirmed
    ↓
Committed

Failed or expired transactions should release applicable
reservations.

---

## 10. Customer Architecture

Customers are associated with the business they interact with.

Customer records may contain information such as:

- Name
- Phone
- Business relationship
- Orders
- Quotes
- Feedback

Customer data must be isolated between businesses in the eventual
multi-tenant architecture.

---

## 11. Quote Architecture

The quote system connects product selection, inventory validation,
delivery, and pricing.

Conceptually:

Customer
    ↓
Product
    ↓
Variant
    ↓
Quantity
    ↓
Stock Validation
    ↓
Delivery Location
    ↓
Delivery Classification
    ↓
Delivery Pricing
    ↓
Delivery ETA
    ↓
Quote
    ↓
Customer Acceptance

A quote contains the commercial information required for the
customer to decide whether to proceed.

The authoritative quote calculation occurs on the backend.

---

## 12. Delivery Classification

The current delivery classification service determines whether a
delivery is Local or Interstate.

Current rule:

Business State = Customer State
    → Local

Business State ≠ Customer State
    → Interstate

State comparison is case-insensitive.

Required location information must be validated before
classification.

---

## 13. Delivery Pricing Service

Delivery pricing is separated from the main order/quote logic.

The delivery pricing service determines the applicable delivery fee.

The architecture supports provider adapters.

Current concepts include:

- Mock delivery provider
- Travo delivery provider

The mock provider is intended for development/testing.

The production system should use a real supported provider.

---

## 14. Delivery Provider Adapter

The provider architecture is intended to prevent ATIVTRAD's core
business logic from becoming permanently dependent on one delivery
company.

Conceptually:

ATIVTRAD Delivery Pricing Service
    ↓
Provider Adapter
    ├── Mock
    ├── Travo
    └── Future Providers

A provider adapter should translate provider-specific responses into
an ATIVTRAD-defined internal format.

---

## 15. Delivery ETA Service

ETA is separated from delivery pricing.

The ETA service can provide:

- Estimated duration
- Distance
- Traffic-awareness information
- Provider

Conceptually:

ATIVTRAD ETA Service
    ↓
ETA Provider
    ├── Mock
    ├── Future Routing Provider
    └── Other Providers

ETA should remain replaceable independently from pricing.

---

## 16. Payment Architecture

ATIVTRAD is designed to integrate with Paystack.

The intended merchant payment architecture is:

Merchant
    ↓
Merchant Paystack Account
    ↓
Customer Payment
    ↓
Paystack
    ↓
ATIVTRAD Backend Verification
    ↓
Order Confirmation

ATIVTRAD should not use one central merchant account to hold all
merchant customer payments.

---

## 17. Payment Verification

Payment status must be determined by trusted backend mechanisms.

The payment layer should support:

- Transaction initialization
- Transaction verification
- Payment status updates
- Payment references
- Payment-provider events/webhooks
- Failure handling

The system must not trust customer-submitted payment claims or
screenshots as authoritative payment confirmation.

---

## 18. Refund Architecture

Refund functionality should be separated from the normal payment
flow.

Conceptually:

Paid Order
    ↓
Authorized Merchant Cancellation
    ↓
Refund Request
    ↓
Original Payment Transaction
    ↓
Payment Provider
    ↓
Refund Status
    ↓
Customer Notification

Refund status must be tracked.

The system should distinguish between:

- Refund requested
- Refund processing
- Refund requiring attention
- Refund failed
- Refund completed

The exact implementation may evolve as the Paystack integration is
built.

---

## 19. Order Architecture

Orders are created from validated commercial transactions.

The intended normal flow is:

Quote
    ↓
Customer Acceptance
    ↓
Payment
    ↓
Payment Verification
    ↓
Order Confirmation
    ↓
Fulfillment

The system should not rely on a manual owner approval step for every
normal paid order.

---

## 20. Order Intervention

Merchant intervention is intended for exceptional circumstances.

Supported operational concepts include:

- Hold
- Resume
- Cancel

These actions should be recorded and auditable.

Merchant intervention must not replace the normal automated
transaction flow.

---

## 21. Local Fulfillment Architecture

Local paid orders may enter automatic rider assignment.

Conceptually:

Confirmed Order
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

Only eligible active riders should participate in automatic rider
assignment.

---

## 22. Interstate Fulfillment Architecture

Interstate orders do not enter the automatic local rider-dispatch
workflow.

After payment confirmation, the order proceeds through the
applicable invoice and OTP process while interstate fulfillment is
handled according to the merchant's operational process.

---

## 23. OTP Architecture

The intended OTP flow is:

Payment Confirmed
    ↓
Order Confirmed
    ↓
OTP Generated
    ↓
OTP Delivered to Customer
    ↓
Rider Requests OTP
    ↓
Backend Verifies OTP
    ↓
Delivery Confirmed

The OTP should not be included in the rider's dispatch information.

---

## 24. Rider Architecture

Riders belong to a merchant/business.

A rider may have operational states such as:

- Active
- Suspended
- Blocked
- Removed

Historical order and delivery records must remain associated with
the rider even after removal.

Suspended, blocked, and removed riders must not be eligible for
automatic dispatch.

---

## 25. Business Settings Architecture

Business-specific settings are stored against the business.

Current settings include concepts such as:

- Business name
- Business phone
- Business address
- State
- Latitude
- Longitude
- Place ID
- Local delivery enablement
- Interstate delivery enablement
- Interstate pricing method
- Interstate fixed fee

Additional settings will be introduced as features are developed.

---

## 26. Business Location Architecture

Business location information is intended to support:

- Address search
- GPS/current location
- Marker adjustment
- Human-readable address
- State
- Latitude
- Longitude
- Place ID

The location system should use verified location data where
available.

ATIVTRAD must not invent geographic information or landmarks.

---

## 27. Business Availability Architecture

Business availability will eventually combine:

- Operating schedule
- Current operating mode
- Temporary overrides

Possible modes include:

Online
Offline — Quote Only
Closed — No Orders

The availability service should provide a single authoritative
answer that other systems can use when determining whether a
business can accept/process transactions.

---

## 28. Subscription and Feature Architecture

ATIVTRAD is intended to use subscription-based feature
entitlements.

Conceptually:

Business
    ↓
Subscription
    ↓
Plan
    ↓
Features / Limits
    ↓
Feature Access

Example:

Premium Plan
    ├── Voice Product Import
    ├── CSV/Excel Import
    ├── Advanced Analytics
    ├── Report Downloads
    └── Other Premium Features

Feature access must be enforced by the backend.

---

## 29. Multi-Tenant Architecture

ATIVTRAD is intended to become a multi-tenant SaaS platform.

Conceptually:

ATIVTRAD
    ├── Business A
    │   ├── Customers
    │   ├── Products
    │   ├── Orders
    │   ├── Quotes
    │   ├── Payments
    │   └── Riders
    │
    ├── Business B
    │   ├── Customers
    │   ├── Products
    │   ├── Orders
    │   ├── Quotes
    │   ├── Payments
    │   └── Riders
    │
    └── Business C
        └── ...

Each business must only be able to access its own data.

Tenant isolation must be enforced by backend/data-access controls,
not by frontend filtering.

Proper multi-tenant isolation must be established before real
multi-business onboarding.

---

## 30. Database Layer

Prisma is used as the application's database access layer.

The database stores persistent business information and transaction
records.

Current schema areas include concepts such as:

- Business
- Customer
- Product
- ProductVariant
- Quote
- QuoteItem
- Payment
- Order
- Rider
- Feedback

The schema will evolve as additional functionality is implemented.

Database migrations must be used when schema changes are introduced.

---

## 31. API Architecture

API endpoints are implemented within the application backend.

Routes should:

1. Receive request.
2. Validate input.
3. Authenticate/authorize where required.
4. Call appropriate business services.
5. Perform database operations.
6. Handle errors.
7. Return structured responses.

Complex business logic should be moved into reusable services rather
than duplicated across multiple routes.

---

## 32. Error Handling

Backend errors should be meaningful and predictable.

Where practical, business errors should use identifiable error codes
or messages.

Examples include:

- CUSTOMER_ADDRESS_REQUIRED
- LOCATION_STATE_REQUIRED
- BUSINESS_NOT_FOUND
- BUSINESS_LOCATION_NOT_CONFIGURED
- LOCAL_DELIVERY_DISABLED
- INTERSTATE_DELIVERY_DISABLED
- INTERSTATE_FIXED_FEE_NOT_CONFIGURED
- PRODUCT_NOT_FOUND
- PRODUCT_VARIANT_NOT_FOUND
- INSUFFICIENT_STOCK

Frontend applications should convert backend errors into useful
human-readable messages.

---

## 33. External Service Architecture

External integrations should be isolated behind service/provider
boundaries.

This reduces dependency on specific vendors and makes future
replacement easier.

Potential integration categories include:

- Payments
- Delivery
- ETA/routing
- WhatsApp/messaging
- AI
- Notifications

External provider credentials must be stored securely and must not
be exposed to clients.

---

## 34. Configuration

Environment-specific configuration should be stored through
environment variables or secure configuration systems.

Examples currently include concepts such as:

- Delivery provider
- Delivery provider credentials
- Mock delivery fee
- ETA provider
- Mock ETA duration
- Mock ETA distance

Development-only mock configuration must not be mistaken for
production configuration.

---

## 35. Frontend Architecture

The frontend uses React-based interfaces within Next.js.

The application uses shared layout components for common navigation
and dashboard structure.

Responsive behavior is a design requirement.

Desktop and mobile interfaces should remain functionally consistent
while adapting their presentation to the available screen size.

---

## 36. Security Boundary

The backend is the primary security and business-rule boundary.

The following must not be trusted as security controls:

- Hidden frontend buttons
- Disabled frontend controls
- Client-side calculations
- Customer claims
- AI responses

Authorization, feature access, validation, payment verification,
inventory operations, and sensitive actions must be enforced on the
server.

---

## 37. Audit Architecture

Important actions should create auditable records.

Examples include:

- Merchant cancellation
- Merchant hold
- Merchant resume
- Refund actions
- Sensitive setting changes
- Rider suspension
- Rider blocking
- Administrative actions
- Security-sensitive operations

The audit system should allow authorized users to understand what
happened, when it happened, and who performed the action.

---

## 38. Development Architecture Principle

ATIVTRAD should avoid unnecessary coupling.

A change to one provider or feature should not require rewriting
unrelated business functionality.

Examples:

Changing a delivery provider should not require rewriting the quote
engine.

Changing an ETA provider should not require rewriting delivery
pricing.

Adding a new subscription plan should not require rewriting every
frontend page.

---

## 39. Current Development Principle

ATIVTRAD is being built incrementally.

The preferred development sequence for significant functionality is:

Business Rule
    ↓
Backend Implementation
    ↓
Backend Test
    ↓
Frontend Integration
    ↓
Frontend Test
    ↓
Documentation
    ↓
Git Commit

This approach is intended to keep the architecture understandable
while the platform grows.

---

## 40. Architectural Evolution

The architecture documented here represents the current direction
and established decisions.

As ATIVTRAD develops, architectural changes may become necessary.

When a significant architectural decision changes:

1. Identify the previous architecture.
2. Explain the reason for the change.
3. Define the new architecture.
4. Update affected implementation.
5. Test the affected functionality.
6. Update documentation.
7. Record the change in the changelog.

Documentation must remain aligned with the actual implementation.