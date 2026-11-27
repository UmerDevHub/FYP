# API contract (the endpoints of the 35% and login)

Both people build against this list. Change it only together, in a pull request.
Answer shapes and status codes are in docs/architecture.md. Roles: visitor (no login), customer, sales_staff, branch_manager, admin.

## S2 Login and account (on top of the 35%)
| Method and path | Who | What it does |
|---|---|---|
| POST /api/auth/register | Public | Creates a customer and logs in. A role sent by the client is ignored. |
| POST /api/auth/login | Public | Checks e-mail and password. Returns the access token and sets the refresh cookie. One general error message. |
| POST /api/auth/refresh | Cookie | Swaps the refresh token for a new pair |
| POST /api/auth/logout | Cookie | Cancels the refresh token |
| POST /api/auth/forgot-password | Public | Sends a one-time link. Same answer for unknown e-mails. |
| POST /api/auth/reset-password | Public | Sets a new password with the one-time token |
| GET /api/auth/me, PATCH /api/auth/me | Logged in | Reads or updates name and phone |
| POST /api/auth/change-password | Logged in | Changes the password after checking the old one |
| GET /api/notifications | Logged in | Own notifications, unread first |
| PATCH /api/notifications/:id/read | Logged in | Marks one as read (extra, Proposal) |

## S1 and S3 Branches, sell requests, arrival
| Method and path | Who | What it does |
|---|---|---|
| GET /api/health | Public | Server and database are up |
| GET /api/branches | Public | Active branches for the form |
| POST /api/sell-requests | Customer | Creates a request in status pending. Notifies the branch manager. |
| GET /api/sell-requests/mine | Customer | The customer's own requests |
| GET /api/sell-requests?status= | Sales staff, manager | Requests of the user's branch |
| GET /api/sell-requests/:id | Owner or branch staff | One request |
| POST /api/sell-requests/:id/accept | Manager | Accepts and sets expires_at 7 days later (A-03). Notifies the customer. |
| POST /api/sell-requests/:id/reject | Manager | Rejects. Body has a reason. Notifies the customer. |
| POST /api/vehicles/arrivals | Sales staff | Records an arrival, with or without a sell request. One transaction. Refused if the request is not accepted or has expired. |

## S4 Inspection
| Method and path | Who | What it does |
|---|---|---|
| GET /api/inspections?status= | Staff, manager | The inspection queue of the branch |
| GET /api/inspections/:id | Branch staff | One inspection with results and photos |
| POST /api/inspections | Sales staff | Starts an inspection for a received vehicle. The vehicle becomes under_inspection. |
| PUT /api/inspections/:id | Owner | Saves the draft (answers, notes, mileage) |
| POST /api/inspections/:id/photos | Owner | Adds photos with a caption |
| POST /api/inspections/:id/submit | Owner | Submits. Answers with a list of what is missing if incomplete. Notifies the manager. |

## S5 Approval and listing
| Method and path | Who | What it does |
|---|---|---|
| POST /api/inspections/:id/approve | Manager | Approves with terms, selling price and "repairs needed". One transaction. The vehicle becomes ready_for_sale or reconditioning. |
| POST /api/inspections/:id/return | Manager | Returns with remarks |
| POST /api/inspections/:id/reject | Manager | Rejects the vehicle with a reason |
| GET /api/vehicles/manage | Staff, manager | All vehicles of the branch in any status |
| PATCH /api/vehicles/:id | Sales staff | Edits description and specification, never the price |
| POST /api/vehicles/:id/photos | Sales staff | Adds listing photos |
| DELETE /api/vehicles/:id | Sales staff | Soft delete with a history row |
| GET /api/vehicles/:id/history | Staff, manager, admin | Status changes and audit rows |

## S6 Repairs
| Method and path | Who | What it does |
|---|---|---|
| GET /api/vehicles/:id/repairs | Manager of the branch | The repair items and their total |
| POST /api/vehicles/:id/repairs | Manager of the branch | Adds one item (description, vendor, amount above zero, date). Only while the vehicle is reconditioning. |
| POST /api/vehicles/:id/repairs/complete | Manager of the branch | Marks the work complete. The vehicle becomes ready_for_sale. With no item saved: 409 until the body says confirmNoWork true. |

## S7 Public pages
| Method and path | Who | What it does |
|---|---|---|
| GET /api/vehicles | Public | The car list with filters, sorting and paging. Only ready_for_sale and not deleted. |
| GET /api/vehicles/:id | Public | One listed car with photos |
| GET /api/vehicles/:id/inspection-report | Public | The approved report without internal data |

Public answers never contain acquisition price, commission, acquisition type, manager remarks, password hashes or tokens. Registration and chassis numbers stay hidden until question Q7 is answered.

## S8 Stock and timed job
| Method and path | Who | What it does |
|---|---|---|
| GET /api/vehicles/stock?branchId=&status=&make= | Manager | Vehicles of all branches with status, branch, days in stock and ageing group. Read only. |
| (no URL) expireOverdue(now) | Timer | Every hour and once at start-up: Accepted requests past expires_at become Expired, the customer is notified, a history row is written. Also: npm run job:expire. |

## Lists
- Paging ?page=2&limit=12 (limit at most 50). Filters one parameter each (?make=toyota&maxPrice=6000000). Sorting ?sort=newest, price_asc, price_desc or mileage_asc.
- The three static paths /vehicles/manage, /vehicles/arrivals and /vehicles/stock come before /vehicles/:id in the routes file.
