# Presentation speaking notes

Use the final PowerPoint. Slides 1–17 are the main talk; 18–19 are viva appendices. Aim for 15–20 minutes plus a 5–10 minute live demonstration. Adapt every first-person claim honestly.

## 1. GlobalCommerce

Good morning. My name is Jawad Ahmad. Today I am presenting GlobalCommerce, my EduQual Level 6 project. The project connects marketplace records, warehouse inventory, international orders, shipment tracking, demand forecasting and operational monitoring. I will first explain the business problem, then the design, and finally demonstrate one international order. The current implementation is a locally deployed proof of concept. Payments, exchange rates, trade charges and sales histories use simulated data; I am not presenting it as a production trading service.

Show: Begin on the title slide. Introduce yourself, look at the panel, and explain the purpose before listing technologies.

If asked: What is the project in one sentence? A shared operating workspace that connects an international order with its stock, shipment, forecast and service-health information.

## 2. The business problem

Consider a customer placing an international order. The merchant needs to know whether stock is really available, what the total cost is, and where the shipment is. If these activities are disconnected, staff must reconcile the information manually. GlobalCommerce brings these records together. Its intended benefit is better coordination and more informed replenishment decisions. This is a design objective, not a measured claim that the prototype has already reduced costs or stockouts.

Show: Use a simple example: a UK customer buys two units from the warehouse with sufficient available stock.

If asked: How would you prove business value? Measure baseline and post-pilot stockouts, fulfilment time, forecast error and manual reconciliation effort.

## 3. What the prototype covers

The prototype has four connected responsibilities. First, it stores marketplace records. Second, it processes inventory reservations and international orders, with a shipment event history. Third, it forecasts demand and proposes replenishment quantities. Fourth, it presents business and technical information. The demonstration uses three warehouse locations and five supported currencies. It does not connect to live payment, carrier or customs services. The source and documentation remain local at present; GitHub submission is a separate step that I will complete after review.

Show: Point out that the full formal project title is recorded in the title-slide notes. Explain implemented scope versus real-world integrations.

If asked: Why a prototype? It permits an end-to-end demonstration and architectural evaluation within the student hardware and time constraints.

## 4. System architecture

The browser runs a React-based console. It sends authenticated requests to a FastAPI application. PostgreSQL stores the business records, while Redis supports rate limiting. Forecasting runs in the application process. Prometheus collects service metrics, and Grafana visualizes those measurements. Docker Compose runs the six services. The design is a modular monolith at the application layer, not a microservice per business feature. This keeps deployment manageable on a 16 GB laptop. A future version could move heavy forecasting jobs to a separate worker and scale the API independently.

Show: Trace browser to API to database. Then trace API metrics to Prometheus to Grafana. Explain Redis separately from the database.

If asked: Why PostgreSQL? Orders, stock, payments and shipment records have relationships, and order creation needs transactional consistency. Why not microservices now? They add distributed failure and deployment complexity.

## 5. Inventory you can explain

On hand is the recorded stock balance. Reserved units are already promised to orders, and available equals on hand minus reserved. With 120 on hand and 3 reserved, 117 remain available. In this prototype dispatched units stay reserved until delivery. An order increases reserved; delivery decreases both on hand and reserved; pre-dispatch cancellation releases reserved. Receipts increase on hand. The API checks these changes inside database transactions. Concurrent PostgreSQL tests confirmed that competing orders did not oversell the tested stock. Inventory and executive totals now use the same available-stock definition.

Show: Use the equation, then point to the Inventory table in the live demo. These large example numbers are illustrative, not a screenshot measurement.

If asked: Why deduct at delivery? It keeps the assessment workflow simple and consistent. A production system should distinguish warehouse stock from a separate in-transit stock ledger. Returns and split fulfilment are future work.

## 6. One order, one workflow

The API validates customer ownership and locks the customer before checking the request key. An identical retry returns the existing order; changed contents with that key are rejected. It locks candidate stock rows in a stable order and chooses one warehouse that can supply every item. Then it reserves stock, rounds charge components and creates the order, simulated payment, shipment and audit records in one transaction. A failure rolls back the uncommitted changes. Concurrent tests covered duplicate requests, competing stock reservations and repeated delivery. Allocation favours available quantity, not distance or transport cost.

Show: Follow the numbered sequence. During the demo, record the order ID and show the corresponding inventory reservation.

If asked: What is idempotency? A safe retry of the same logical request should not create another order. The client retains its key after a network interruption. An altered payload must use a new logical request and key.

## 7. International order costing

International processing needs more than changing a currency symbol. This prototype stores an order currency and calculates goods, shipping, duty and tax. Its shipping rule is twelve dollars plus three point two dollars per kilogram. Duty is five percent of goods value; tax is eight percent of goods value plus duty. These are demonstration formulas, not real customs advice or country-specific tax rules. Payment authorization and capture are simulated. Production would require jurisdiction-specific rules, payment-provider integration, rounding policies and reliable exchange-rate history.

Show: Open a demo order and identify its currency and separate charge fields. Never call the mixed-currency dashboard total audited revenue.

If asked: Why retain currency per order? A numeric amount is ambiguous without currency, conversion basis and rounding rules.

## 8. Logistics visibility

Shipment events are manual simulations, not live carrier updates. The normal path is created, picked, in transit, customs clearance, out for delivery and delivered. The API validates each transition and locks the associated order, so cancellation and delivery cannot independently change it at the same time. Dispatch prevents cancellation. In-transit stages can be marked delayed, with valid recovery options. A delivered shipment cannot be delivered again. The order detail shows the tracking number and time-stamped history.

Show: Advance the demo shipment through its valid stages. Optionally mark it delayed in transit and resume. Show the history and the delivery stock change.

If asked: What if an event is repeated? Repeated delivery is rejected by the current state and protected transaction. A real carrier adapter also needs durable external event IDs and deduplication.

## 9. Demand forecasting

Daily sales history is seeded or imported by CSV. It is separate from operational orders. Eligible series have at least thirty-five observations and recent history. Features include past lags, a shifted rolling mean, weekday and trend. Earlier dates train the model; later dates form a fixed-origin recursive holdout. The model does not use future holdout actuals as later input. We compare a Random Forest with a seasonal-naive weekly baseline and select the lower MAE. Then we refit on all history and forecast tomorrow onward for one to thirty days. This is still synthetic-data evidence, and using the same holdout for selection means it is not an independent final test.

Show: Trace the stages, then show the actual MAE and RMSE produced by a run. Do not invent a percentage accuracy.

If asked: Why a baseline? Complexity is not automatically better. MAE measures average absolute unit error; RMSE penalizes large misses. Real deployment needs rolling-origin tests on representative data.

## 10. From forecast to stock

Replenishment equals the maximum of zero and forecast demand plus safety stock minus available stock. In the example, sixty plus fifteen minus fifty gives twenty-five units. Those numbers are illustrative. The safety allowance uses the selected model's error and the horizon, so it is a heuristic rather than a service-level guarantee. Recommendations show the stock snapshot at run time and current available stock separately. New orders change stock but do not retrain the model or automatically recalculate the saved recommendation. A person reviews the suggestion. Supplier lead times, minimum purchase quantities and procurement approval are future work.

Show: Explain each term before reading the result. During the demo, compare a forecast recommendation with the relevant warehouse balance.

If asked: Can the model be wrong? Yes. New promotions, changing demand and poor data can invalidate the pattern. A person should review recommendations; formal approval is not implemented.

## 11. Monitoring has three roles

The commerce console manages business records. Prometheus collects time-series measurements and Grafana visualizes them. The integrated Monitoring page summarizes selected technical signals without replacing those tools. Request rate counts API calls, not orders. P95 latency is approximately the duration within which ninety-five percent of measured requests complete, not an average. Server-error rate counts failures. The Online label is a point-in-time API response check, not a claim of perfect uptime. Sparse measurements after startup are labelled warming or unavailable. In Analytics, delivery completion is a separate business ratio, not on-time performance.

Show: Open Monitoring, explain requests per second, error rate and p95 latency, then follow the Grafana link. Explain that a quiet system can have little recent data.

If asked: What is p95 latency? Approximately ninety-five percent of observed requests fall at or below that duration in the selected measurement window.

## 12. The local operating workspace

This is a genuine screenshot of the local Inventory page, captured during slide preparation. The navigation connects marketplace, inventory, orders, forecasting, analytics and monitoring. The table separates physical stock from reservations and available units. The Dubai control-hub row shows 180 on hand, 3 reserved and 177 available at the time of capture. The purpose of the screen is operational clarity, not decorative dashboard numbers. A screenshot is a backup illustration; the assessed demonstration should show an actual request and the corresponding persistent record change.

Show: Point out the selected Inventory page and the three quantity columns. Explain that live values may differ from the screenshot after new orders.

If asked: Why the bento-style interface? It organizes related information into scannable regions. Visual polish does not replace data correctness or usability testing.

## 13. Security and accountability

Authentication identifies a user; authorization determines which actions and records they can access. Customer endpoints enforce ownership, merchant reports contain only owned product lines, and staff roles control administrative and operational writes. Staff intentionally have cross-merchant operational access. Tests cover wrong credentials, missing tokens and unauthorized object access. Passwords are hashed. Rate limiting, request IDs and audit entries support operations. The deployment binds to localhost, but uses HTTP and demo credentials. Production needs stronger identity, managed secrets and independent security testing. None of these controls amounts to ISO certification.

Show: Explain one protected endpoint and an audit record. Do not display passwords, bearer tokens or local secret values in slides or screen sharing.

If asked: What are the remaining security limitations? Local HTTP, demonstration credentials, broad staff scopes, no MFA, fail-open rate limiting during Redis failure and no formal penetration test.

## 14. Evidence before confidence

The recorded backend suite passed twenty tests with approximately ninety percent line coverage. Most functional cases run in isolated SQLite databases. A separate PostgreSQL test checks real concurrent requests: identical retries produce one order, competing orders do not oversell, and delivery deducts once. Frontend source contracts, TypeScript and production build checks cover a different layer. The verification folder contains exact outputs and scan scope. Coverage and clean scans do not guarantee every behaviour or security condition. There is no production-scale throughput benchmark and no claim of real-business forecast accuracy.

Show: Open reports/verification and show the dated results. Explain one negative test and the isolated PostgreSQL evidence.

If asked: What still needs testing? Real-data forecast evaluation, large-scale load, external provider failure modes, penetration testing and broader automated browser regression.

## 15. Live demonstration

I will now demonstrate one order from beginning to end. First I will show that the services are running and open the inventory balance. I will create a two-unit order for a UK destination in GBP and show the order ID, simulated charges and reserved units. Next I will advance the shipment and inspect its event history. Finally I will run a seven-day forecast and open the monitoring views. This connects the business workflow to its stored records and technical visibility. The current quantities may differ because this is a running demonstration system.

Show: Allow about five minutes if the exam timing permits. Open http://localhost:3000, http://localhost:8000/docs, http://localhost:3001 and http://localhost:9090 in advance. Verify every step before exam day. Do not run reset-demo during the assessment or erase existing records without reviewing the impact. Return to slide 16 afterward.

If asked: If the UI fails, use the documented API only if rehearsed. If using screenshots or a recording, identify them clearly as recorded evidence, not live execution.

## 16. From prototype to production

The local assessment features are connected and testable. Production is a separate stage. It needs real provider adapters, current trade rules, external identity, TLS, managed secrets and tighter staff access. Forecasting needs representative data, independent rolling evaluation, supplier lead times and calibrated inventory policies. Larger workloads need background workers, database tuning, pagination and measured capacity. A production financial ledger should use fixed-precision database columns. Returns, split shipments and procurement are not part of this local version. The assigned enterprise-scale scenario guides the architecture; it is not a measured throughput result.

Show: Lead with correctness, then security, then model quality and scale. Explain one specific fix if the panel asks for a redesign.

If asked: How would you scale? Separate forecast workers, make API replicas stateless, tune database queries and connection pools, introduce reliable integration events, then measure bottlenecks.

## 17. Conclusion

GlobalCommerce connects marketplace administration, inventory, international orders, shipment history, forecasting and reporting in one local system. The demonstration shows real database changes with explicit business definitions, and the test evidence supports the checked workflows. External commerce services and historical seed data are simulated. The system has clear boundaries and a documented path toward production. Thank you for listening. I welcome questions about the implementation, tests, limitations and design decisions. I will explain only the work I personally understand and the checks I have actually reproduced.

Show: Stop here for the main presentation. Appendix slides 18 and 19 are for questions and preparation, not part of the main speech.

If asked: What did you learn? Answer personally and truthfully about the code paths you understand, decisions you reviewed and tests you can reproduce.

## 18. Appendix: design questions

Answer each design question with the decision, its reason, its evidence and its limitation. For overselling, explain transactional reservations and the separate PostgreSQL concurrency test. For forecasting, explain the chronological recursive holdout and seasonal baseline, then acknowledge synthetic data and selection bias. For failures, explain rollback, retained request keys and state validation. Production event delivery still needs an outbox and external deduplication. If asked to redesign for a twenty-one-day lead time, adapt the horizon and stock policy, then evaluate on matching multi-day backtests.

Show: Practice these questions without reading the slide. Be ready to locate the corresponding source function and explain it line by line.

If asked: Unexpected redesign: if supplier lead time becomes twenty-one days, adapt the forecast horizon and inventory policy, then validate on matching multi-day holdouts.

## 19. Appendix: evidence and tools

The assessment guide allows AI assistance but requires the student to understand, justify and verify the work. AI tools assisted the preparation of code, documentation and these presentation materials. That assistance is not a substitute for my own understanding. Before presenting, I need to personally review the code, run the system, reproduce the tests and be able to explain the design and limitations. I should describe only the checks I actually completed. The slides contain source references in their notes, and the screenshot is from the local application rather than a mock-up.

Show: Preparation checklist: rehearse opening and closing; verify demo data; rerun tests; review the critical code; prepare a clearly labelled backup recording; review submission rules; upload to your own GitHub repository only when satisfied. Replace any personal speaking claims with wording that is true for you.

If asked: How were tools used? Explain exactly which work was assisted, what you changed or reviewed, and what evidence you independently checked. Do not claim unaided authorship.