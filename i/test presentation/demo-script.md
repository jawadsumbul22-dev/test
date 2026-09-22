# Live demonstration: 5–10 minutes

Open the app and required tabs before presenting. Use your current data; do not reset during the exam.

1. Show Docker Compose services. Say: “Six local services support the application, database, rate limiter and monitoring.”
2. Sign in as administrator. Open Inventory. Pick an active product and record its warehouse on-hand, reserved and available quantities. Explain available = on hand - reserved.
3. Open Orders. Choose a customer, that product, quantity 2, destination UK and GBP. Confirm once. Show the new order number and the product name × 2 in Lifecycle control. Orders created increases by one; active units increase by two.
4. Open the detail. Explain goods, shipping, duty, tax, total, exchange rate, simulated payment authorization and tracking number. Identify the allocated warehouse.
5. Return to Inventory. Its reserved units increased by 2; available decreased by 2. On hand has not changed. If another warehouse was selected, inspect that row, not an unrelated one.
6. Return to the order and advance through picked, in transit, customs, out for delivery and delivered. Show event history. At delivery, on hand and reserved each decrease by 2; available stays as it was after reservation. The payment becomes captured.
7. Optional: create a separate one-unit order and cancel before dispatch. Show its released stock and cancelled status. Never cancel the delivered example.
8. Forecasting: run a seven-day forecast. Show selected model, holdout comparison, future dates and one recommendation. Explain model error and human review. Sales history is imported separately; new orders do not retrain automatically.
9. Analytics: download the inventory or orders CSV. Compare its definitions and timestamp with the dashboard. Do not sum repeated order totals in the line-level CSV.
10. Monitoring: show traffic, p95 latency and errors. Open Grafana for detailed graphs. API request counts are not business-order counts.

Closing: “The demonstration connected one order to its reservation, charges, tracking, delivery, stock deduction and reports. Forecasting is decision support built from separate historical sales.”

If an error occurs, read it and explain it. Refresh to inspect persisted state before retrying. Never describe a recording as live. Keep the final report and a personally recorded backup demo available offline.
