# AutoMall Pro — Phygital Vehicle Auctions & Lifecycle Services Workbench

Built by **Selvaraj Ganesan** (Senior Frontend Developer | React, TypeScript, Redux Toolkit) combining **Spinny-inspired consumer-grade clean UI/UX** (Deep Plum `#2E054E`, Coral `#ED264F`, crisp white cards, 200-point inspection trust badges) with **enterprise vehicle auction & ancillary service workflows** (live bidding, EMD deposit checks, confidential reserve prices, seller bid approvals, RTO/RC transfers, and yard logistics).

---

## Key Senior Frontend Capabilities Demonstrated
1. **Persona-Based RBAC (`BUYER`, `SELLER_NBFC`, `OPS_ADMIN`):**
   - Buyers can place live bids with EMD balance validation while seller reserve (ACR) and full registration numbers remain masked.
   - Sellers/NBFCs can inspect confidential reserve prices and approve winning bids.
   - Ops Admins govern 200-point inspection grades, RTO transfers, and yard/doorstep logistics.
2. **Optimistic Bid Updates & Fault Rollback:**
   - Instant bid UI updates with automatic rollback if upstream auction gateway times out (**Simulate Gateway Fault** toggle included).
3. **Real-Time Auction Countdown & Debounced Multi-Facet Filtering:**
   - Live 1-second auction timers transitioning expired lots to `PENDING_SELLER_APPROVAL`, plus debounced search across 180+ multi-category lots.

## Run Locally
```bash
npm install
npm run dev
npm test
```
