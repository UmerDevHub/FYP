# Data model (17 tables for the 35% and login)

The SRDS data design has 38 tables for the whole system. These 17 are the part needed here.
Use the SRDS column lists as the master. If this file and the SRDS disagree, tell me. Do not choose silently.

## Tables by slice
| Slice | Table | Purpose and main columns |
|---|---|---|
| S1 | branches | name (unique), city, address, is_active |
| S1 | users | email (unique, lower case), password_hash, role, branch_id, failed_logins, locked_until, is_active |
| S1 | refresh_tokens | user_id, token_hash, family_id, expires_at, revoked_at |
| S1 | password_resets | user_id, token_hash, expires_at, used_at |
| S1 | notifications | user_id, title, message, link, is_read |
| S1 | activity_logs | user_id, action, entity_type, entity_id, old_value, new_value |
| S3 | sell_requests | customer_id, branch_id, make, model, year, mileage_km, expected_price, status, decision_reason, expires_at |
| S3 | vehicles | sell_request_id (optional), branch_id, registration_no, chassis_no, specification columns, status, selling_price, received_at, listed_at, is_deleted |
| S3 | vehicle_photos | vehicle_id, file_path, sort_order, is_cover |
| S3 | vehicle_status_history | vehicle_id, from_status, to_status, changed_by, note, created_at |
| S3 | vehicle_documents | vehicle_id, doc_type, file_path, is_verified (table only; no screen in the 35%; Proposal: skip it if time is short) |
| S4 | checklist_items | category, name, sort_order, is_active (24 seeded items, Proposal) |
| S4 | inspections | vehicle_id, inspector_id, mileage_km, documents_verified, notes, status, reviewed_by, review_remarks |
| S4 | inspection_results | inspection_id, checklist_item_id, result, remarks |
| S4 | inspection_photos | inspection_id, file_path, caption |
| S4 | inspection_events | inspection_id, action, user_id, remarks, created_at (not one of the 17; Proposal, keeps every return remark: FR-IN-08) |
| S5 | acquisitions | vehicle_id (unique), type, purchase_price, commission_percent, approved_by |
| S6 | repair_costs | vehicle_id, description, vendor, amount, incurred_on, recorded_by |

## Rules the database enforces (write them as constraints, not only as code)
- One account per e-mail address (unique index on lower case e-mail).
- Staff and managers must have a branch: check on users (role and branch_id agree).
- Roles and statuses are PostgreSQL enum types.
- A rejected sell request has a reason.
- Registration number and chassis number are unique among non-deleted vehicles (partial unique indexes, FR-AC-05).
- A listed or sold vehicle has a selling price above zero.
- Only one open inspection per vehicle: partial unique index on inspections(vehicle_id) where status is draft, submitted or returned.
- A returned or rejected inspection has remarks.
- One result per checklist item per inspection (unique pair).
- A purchase has a purchase price. A consignment has a commission percent. A repair cost has an amount above zero.

## Conventions
- Primary keys: bigint identity. The driver parses bigint to a number once. Money is numeric(12,2) and stays text in JavaScript.
- Time: timestamptz, stored in UTC. Display in the Pakistan time zone (A-04). Currency is PKR (A-04).
- Soft delete for vehicles (is_deleted, deleted_at, deleted_by). Photos: store the path, keep the file on disk under a random name.
- Days in stock and the ageing group are calculated, never stored. Ageing ranges live in LIMITS.AGEING_DAYS = [30, 60, 90] (Proposal; NFR-MT-05).
- Only hashes of passwords and tokens are stored.

## Indexes (add only when a screen needs it)
- vehicles (status, listed_at desc) where not deleted: public list
- vehicles (branch_id, status) where not deleted: staff list and stock list
- sell_requests (branch_id, status) and (customer_id); sell_requests (status, expires_at) where status is accepted: expiry job
- inspections (status): review queue. repair_costs (vehicle_id). refresh_tokens (family_id)
- notifications (user_id). activity_logs (entity_type, entity_id)

## Seed data
- Three branches (the SRDS says AK Motors has three; the names are placeholders).
- Five demo accounts: admin, manager of branch 1, sales staff of branch 1, sales staff of branch 2, customer. One demo password, development only, written in the README (FR-AD-07).
- The 24 checklist items in 6 categories (S4). Exterior 6, Engine 5, Transmission and brakes 3, Suspension and steering 3, Interior 5, Electrical 2.
