import {root,project,fullTitle,slides as original} from "./content.mjs";
export {root,project,fullTitle};
export const finalPath = project + "/docs/GlobalCommerce-Final-Presentation-Jawad-Ahmad.pptx";
export const slides = structuredClone(original);
const updates = {
  "4": {
    "say": "On hand is the recorded stock balance. Reserved units are already promised to orders, and available equals on hand minus reserved. With 120 on hand and 3 reserved, 117 remain available. In this prototype dispatched units stay reserved until delivery. An order increases reserved; delivery decreases both on hand and reserved; pre-dispatch cancellation releases reserved. Receipts increase on hand. The API checks these changes inside database transactions. Concurrent PostgreSQL tests confirmed that competing orders did not oversell the tested stock. Inventory and executive totals now use the same available-stock definition.",
    "ask": "Why deduct at delivery? It keeps the assessment workflow simple and consistent. A production system should distinguish warehouse stock from a separate in-transit stock ledger. Returns and split fulfilment are future work."
  },
  "5": {
    "say": "The API validates customer ownership and locks the customer before checking the request key. An identical retry returns the existing order; changed contents with that key are rejected. It locks candidate stock rows in a stable order and chooses one warehouse that can supply every item. Then it reserves stock, rounds charge components and creates the order, simulated payment, shipment and audit records in one transaction. A failure rolls back the uncommitted changes. Concurrent tests covered duplicate requests, competing stock reservations and repeated delivery. Allocation favours available quantity, not distance or transport cost.",
    "ask": "What is idempotency? A safe retry of the same logical request should not create another order. The client retains its key after a network interruption. An altered payload must use a new logical request and key."
  },
  "7": {
    "bullets": [
      "Each order links to a shipment and tracking reference.",
      "Events record status, location, timestamp and a note.",
      "The server enforces progress, delay and recovery rules.",
      "Delivery captures payment and deducts stock once."
    ],
    "say": "Shipment events are manual simulations, not live carrier updates. The normal path is created, picked, in transit, customs clearance, out for delivery and delivered. The API validates each transition and locks the associated order, so cancellation and delivery cannot independently change it at the same time. Dispatch prevents cancellation. In-transit stages can be marked delayed, with valid recovery options. A delivered shipment cannot be delivered again. The order detail shows the tracking number and time-stamped history.",
    "show": "Advance the demo shipment through its valid stages. Optionally mark it delayed in transit and resume. Show the history and the delivery stock change.",
    "ask": "What if an event is repeated? Repeated delivery is rejected by the current state and protected transaction. A real carrier adapter also needs durable external event IDs and deduplication."
  },
  "8": {
    "say": "Daily sales history is seeded or imported by CSV. It is separate from operational orders. Eligible series have at least thirty-five observations and recent history. Features include past lags, a shifted rolling mean, weekday and trend. Earlier dates train the model; later dates form a fixed-origin recursive holdout. The model does not use future holdout actuals as later input. We compare a Random Forest with a seasonal-naive weekly baseline and select the lower MAE. Then we refit on all history and forecast tomorrow onward for one to thirty days. This is still synthetic-data evidence, and using the same holdout for selection means it is not an independent final test.",
    "ask": "Why a baseline? Complexity is not automatically better. MAE measures average absolute unit error; RMSE penalizes large misses. Real deployment needs rolling-origin tests on representative data."
  },
  "9": {
    "say": "Replenishment equals the maximum of zero and forecast demand plus safety stock minus available stock. In the example, sixty plus fifteen minus fifty gives twenty-five units. Those numbers are illustrative. The safety allowance uses the selected model's error and the horizon, so it is a heuristic rather than a service-level guarantee. Recommendations show the stock snapshot at run time and current available stock separately. New orders change stock but do not retrain the model or automatically recalculate the saved recommendation. A person reviews the suggestion. Supplier lead times, minimum purchase quantities and procurement approval are future work."
  },
  "10": {
    "say": "The commerce console manages business records. Prometheus collects time-series measurements and Grafana visualizes them. The integrated Monitoring page summarizes selected technical signals without replacing those tools. Request rate counts API calls, not orders. P95 latency is approximately the duration within which ninety-five percent of measured requests complete, not an average. Server-error rate counts failures. The Online label is a point-in-time API response check, not a claim of perfect uptime. Sparse measurements after startup are labelled warming or unavailable. In Analytics, delivery completion is a separate business ratio, not on-time performance."
  },
  "12": {
    "bullets": [
      "JWT authentication, Argon2 hashes and active-account checks.",
      "Server-side role and customer/merchant ownership rules.",
      "Rate limiting, request IDs, audit records and stock locks.",
      "Localhost only; production still needs MFA, TLS and managed secrets."
    ],
    "say": "Authentication identifies a user; authorization determines which actions and records they can access. Customer endpoints enforce ownership, merchant reports contain only owned product lines, and staff roles control administrative and operational writes. Staff intentionally have cross-merchant operational access. Tests cover wrong credentials, missing tokens and unauthorized object access. Passwords are hashed. Rate limiting, request IDs and audit entries support operations. The deployment binds to localhost, but uses HTTP and demo credentials. Production needs stronger identity, managed secrets and independent security testing. None of these controls amounts to ISO certification.",
    "ask": "What are the remaining security limitations? Local HTTP, demonstration credentials, broad staff scopes, no MFA, fail-open rate limiting during Redis failure and no formal penetration test."
  },
  "13": {
    "bullets": [
      "20 backend regression tests; about 90% application line coverage.",
      "PostgreSQL checks: duplicate requests, competing stock and delivery.",
      "Frontend contracts, TypeScript checks and production build.",
      "Dated security reports; no production load or real-data accuracy claim."
    ],
    "say": "The recorded backend suite passed twenty tests with approximately ninety percent line coverage. Most functional cases run in isolated SQLite databases. A separate PostgreSQL test checks real concurrent requests: identical retries produce one order, competing orders do not oversell, and delivery deducts once. Frontend source contracts, TypeScript and production build checks cover a different layer. The verification folder contains exact outputs and scan scope. Coverage and clean scans do not guarantee every behaviour or security condition. There is no production-scale throughput benchmark and no claim of real-business forecast accuracy.",
    "show": "Open reports/verification and show the dated results. Explain one negative test and the isolated PostgreSQL evidence.",
    "ask": "What still needs testing? Real-data forecast evaluation, large-scale load, external provider failure modes, penetration testing and broader automated browser regression."
  },
  "15": {
    "bullets": [
      "Integrate real payments, carriers, exchange and trade rules.",
      "Add TLS, MFA, managed secrets and restricted staff scopes.",
      "Validate real sales with rolling backtests and calibrated ranges.",
      "Add workers, split shipments, returns, procurement and load tests."
    ],
    "say": "The local assessment features are connected and testable. Production is a separate stage. It needs real provider adapters, current trade rules, external identity, TLS, managed secrets and tighter staff access. Forecasting needs representative data, independent rolling evaluation, supplier lead times and calibrated inventory policies. Larger workloads need background workers, database tuning, pagination and measured capacity. A production financial ledger should use fixed-precision database columns. Returns, split shipments and procurement are not part of this local version. The assigned enterprise-scale scenario guides the architecture; it is not a measured throughput result."
  },
  "16": {
    "say": "GlobalCommerce connects marketplace administration, inventory, international orders, shipment history, forecasting and reporting in one local system. The demonstration shows real database changes with explicit business definitions, and the test evidence supports the checked workflows. External commerce services and historical seed data are simulated. The system has clear boundaries and a documented path toward production. Thank you for listening. I welcome questions about the implementation, tests, limitations and design decisions. I will explain only the work I personally understand and the checks I have actually reproduced."
  },
  "17": {
    "say": "Answer each design question with the decision, its reason, its evidence and its limitation. For overselling, explain transactional reservations and the separate PostgreSQL concurrency test. For forecasting, explain the chronological recursive holdout and seasonal baseline, then acknowledge synthetic data and selection bias. For failures, explain rollback, retained request keys and state validation. Production event delivery still needs an outbox and external deduplication. If asked to redesign for a twenty-one-day lead time, adapt the horizon and stock policy, then evaluate on matching multi-day backtests."
  }
};
for (const [index, value] of Object.entries(updates)) Object.assign(slides[Number(index)], value);
