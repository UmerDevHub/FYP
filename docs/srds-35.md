# SRDS v1.3: the 35% (summary for Claude)

Source: the Vehicle 360 SRDS v1.3. A line that starts with an id (FR, NFR, A) is copied word for word.
The text in square brackets at the end of an FR line was added by the team: the SRDS phase and the use cases.
Anything marked Proposal is not from the SRDS. If this file and the SRDS disagree, the SRDS wins. Tell me, do not choose silently.

## 1. Scope
- Inside the 35% (names as in the SRDS): UC-05 Browse and View Vehicles, UC-06 View Inspection Report, UC-12 Submit Sell-Your-Car Request, UC-13 Track Requests and Bookings, UC-14 Record Vehicle Arrival, UC-15 Conduct Vehicle Inspection, UC-16 Generate Inspection Report, UC-18 Manage Vehicle Listing and Documents, UC-19 View Vehicle History, UC-23 Review Sell Request, UC-24 Review Inspection Report, UC-25 Set Acquisition Terms and Price, UC-27 Manage Reconditioning and Repair Costs, UC-28 Monitor Inventory and Stock Ageing, UC-34 Manage Branches (seed data only), UC-39 Run Scheduled Jobs.
- On top of the 35%: UC-01 Register Account, UC-02 Log In and Log Out, UC-03 Reset Password, UC-04 Manage My Account.
- UC-27 is marked Later in the SRDS. The plan moves it in (Proposal). FR-IV-05 (stock ageing) is also marked Later but UC-28 lists it, so it is built with UC-28.
- Not built (Later): favourites, chatbot, vehicle inquiry, test drive and inspection bookings, vehicle booking and sale, transfers between branches, leads, price estimate and fair price check, dashboards and reports, WhatsApp, admin screens (users, settings, branches).

## 2. Accounts and access
- FR-AU-01 Customer registration. The system shall allow a visitor to register as a customer
  by entering name, email, phone number and password. The email address shall be unique. The
  role of a self-registered user shall always be Customer. [Phase 1; UC-01]
- FR-AU-02 User login. The system shall authenticate a user with email and password. If the
  details are wrong or the account is inactive, the system shall show one general error
  message that does not reveal which detail was wrong. [Phase 1; UC-02]
- FR-AU-03 Session handling. The system shall keep the user logged in with a short- lived
  access token and a renewable refresh token. Logging out shall cancel the refresh token.
  [Phase 1; UC-02]
- FR-AU-04 Password reset. The system shall send a one-time reset link to the registered
  email. The link shall expire after a fixed time and shall work only once. [Phase 1; UC-03]
- FR-AU-05 Profile management. The system shall let a logged-in user view and update name and
  phone number, and change the password after entering the old password. [Phase 1; UC-04]
- FR-AU-06 Role-based access control. The system shall check the role of the user on the
  server for every protected operation and shall refuse operations that the role is not
  allowed to perform. [Phase 1]
- FR-AU-07 Branch restriction. The system shall limit Sales Staff and Branch Managers to the
  records of their own branch for sell requests, inspections and vehicle management. Inventory
  viewing across branches is allowed for Branch Managers (FR-IV-01). [Phase 1; UC-14, UC-23,
  UC-24]
- FR-AD-07 Seed accounts. Until the Admin screens are built, the system shall provide a seed
  script that creates the first Admin, the Branch Managers and the Sales Staff accounts.
  [Phase 1; UC-33]

## 3. Sell requests
- FR-CU-11 Sell-your-car request. The system shall let a logged-in customer submit a sell
  request with branch, make, model, year, mileage, expected price and description. The request
  shall start in the Pending status. [Phase 1; UC-12]
- FR-CU-12 Track requests and bookings. The system shall let a customer view the status and
  history of their sell requests, inquiries, test drive bookings and inspection bookings.
  Records shall be kept after completion. [Phase 1; UC-13]
- FR-BM-01 Sell request decision. The system shall let a Branch Manager accept or reject a
  Pending sell request of their branch. A rejection shall have a reason. An accepted request
  shall expire if the seller does not arrive in time. [Phase 1; UC-23, UC-39]
- A-03 Sell request statuses are Pending, Accepted, Rejected, Expired and Completed. An accepted request expires if the seller does not arrive within 7 days.
- A-05 The customer chooses the branch for a sell request or an inspection booking, and the manager of that branch handles it.

## 4. Arrival and the vehicle record
- FR-SS-01 Record vehicle arrival. The system shall let Sales Staff record the arrival of a
  vehicle linked to an accepted sell request, or as a walk-in vehicle without a request. The
  vehicle shall be created in the Received status and the request shall become Completed.
  [Phase 1; UC-14]
- FR-SS-08 Branch work list. The system shall show Sales Staff the accepted sell requests,
  their vehicles and their inspections of their own branch, with filters by status. [Phase 1;
  UC-14]
- FR-AC-01 Lifecycle statuses. The system shall move every vehicle through the statuses
  Received, Under Inspection, Reconditioning, Ready for Sale, Booked, Sold and Delivered. An
  additional status Rejected shall be used for vehicles refused after inspection (assumption
  A-02). [Phase 1; UC-14, UC-24]
- FR-AC-02 Allowed transitions. The system shall allow only the transitions shown in the state
  model in Section 5.5 and shall refuse any other change. [Phase 1]
- FR-AC-03 Status history. The system shall store every vehicle status change with the old
  status, new status, user, time and note, and shall show the history to staff and managers.
  [Phase 1; UC-19]
- FR-AC-05 Unique vehicle identity. The system shall not allow two non-deleted vehicles with
  the same registration number or the same chassis number. [Phase 1; UC-14]
- A-02 One extra vehicle status, Rejected, is added. A cancelled or expired booking returns the vehicle to Ready for Sale. Reconditioning can be skipped when no repair is needed.
- A-04 Currency is PKR and times are in the Pakistan time zone.

## 5. Inspection
- FR-IN-01 Start inspection. The system shall allow Sales Staff to start an inspection for a
  vehicle in the Received status of their branch. The vehicle shall move to Under Inspection.
  [Phase 1; UC-15]
- FR-IN-02 Standard checklist. The system shall show a standard checklist grouped in
  categories. For every item the inspector shall select Good, Fair, Poor or Not Applicable and
  may add a remark. [Phase 1; UC-15, UC-35]
- FR-IN-03 Mileage and documents. The system shall record the mileage found at inspection and
  whether the vehicle documents were verified, with notes. [Phase 1; UC-15]
- FR-IN-04 Damage and repaint notes. The system shall record visible damage and repaint
  observations as text notes. [Phase 1; UC-15]
- FR-IN-05 Inspection photos. The system shall let the inspector upload photos with captions.
  Only JPG and PNG files up to 5 MB shall be accepted. [Phase 1; UC-15]
- FR-IN-06 Draft and submit. The system shall save an inspection as a draft and shall submit
  it only when every checklist item has a result, mileage is entered and the minimum number of
  photos is attached. [Phase 1; UC-15]
- FR-IN-07 Inspection report. The system shall generate a structured inspection report from
  the submitted data, showing vehicle details, inspector, dates, checklist results,
  observations and photos. The report shall be printable. [Phase 1; UC-06, UC-16]
- FR-IN-08 Inspection history. The system shall keep every submission and every manager
  decision of an inspection, including returned remarks, so that the full history can be seen.
  [Phase 1; UC-15, UC-24]
- A-06 Photos and documents are stored on the server disk through a storage service. At least 4 inspection photos are needed to submit an inspection.
- The SRDS does not list the checklist items. The 24 items in 6 categories are a Proposal kept in the seed file.

## 6. Approval, acquisition and the listing
- FR-BM-02 Inspection review. The system shall let a Branch Manager open a submitted
  inspection report and approve it, return it with remarks, or reject the vehicle with a
  reason. [Phase 1; UC-24]
- FR-BM-03 Acquisition terms. On approval the system shall require the manager to choose
  Purchase with a purchase price, or Consignment with a commission percentage, and to enter
  the selling price. [Phase 1; UC-25]
- FR-AC-04 Acquisition record. The system shall store for every accepted vehicle whether it
  was acquired by purchase or consignment, with the purchase price or the commission
  percentage, and who approved it. [Phase 1; UC-25]
- FR-SS-03 Edit listing. The system shall let Sales Staff edit the description, specification
  details and photos of a vehicle listing of their branch. Price fields shall not be editable
  by Sales Staff. [Phase 1; UC-18]
- FR-SS-04 Delete listing. The system shall let Sales Staff delete a vehicle listing by soft
  delete. A deleted listing shall not be visible to the public and the deletion shall be
  recorded in the vehicle history. [Phase 1; UC-18]
- A-20 The Branch Manager decides at approval whether a vehicle needs reconditioning.

## 7. Repairs (moved into the 35% by the plan)
- FR-AC-06 Reconditioning. When repair work is needed, the system shall hold the vehicle in
  the Reconditioning status until the manager marks the work complete, after which the vehicle
  becomes Ready for Sale. [SRDS marks it Later; the plan moves it in; UC-27]
- FR-AC-07 Repair cost records. The system shall let the Branch Manager record repair and
  reconditioning expenses for a vehicle with description, vendor, amount and date. [SRDS marks
  it Later; the plan moves it in; UC-27]
- A-02 and A-20 above apply. The full acquisition cost of FR-AC-08 is not built (open question). Only the total of the repair costs is shown.

## 8. Public pages
- FR-CU-01 Browse vehicle listings. The system shall show all vehicles in the Ready for Sale
  status, which are not deleted, to visitors and customers. Each card shall show the cover
  photo, make, model, year, price, mileage and branch. [Phase 1; UC-05]
- FR-CU-02 Search and filter. The system shall filter vehicles by keyword, make, model,
  variant, year range, price range, mileage range, fuel type, transmission, body type, engine
  capacity, colour, city and branch. Selected filters shall be kept in the page address.
  [Phase 1; UC-05]
- FR-CU-03 Sort and paging. The system shall sort the list by newest, price, year and mileage
  and shall show results in pages. [Phase 1; UC-05]
- FR-CU-04 Vehicle details. The system shall show photos, specifications, price, description
  and branch of a vehicle. Internal data such as acquisition price, commission and manager
  remarks shall never be shown. [Phase 1; UC-05]
- FR-CU-05 View approved inspection report. The system shall show the approved inspection
  report of a listed vehicle, including checklist results, photos, mileage and observations.
  [Phase 1; UC-06]
- Proposal: until question Q7 is answered, registration and chassis numbers are not shown on public pages.
- Proposal: start with five filters (make, model, year range, price range, fuel). Add the others of FR-CU-02 one at a time.

## 9. Stock and the timed job
- FR-BM-06 Branch vehicle list. The system shall show the Branch Manager all vehicles of their
  branch in every status with filters. [Phase 1; UC-28]
- FR-IV-01 Real-time stock view. The system shall show a Branch Manager the vehicles of all
  three branches with status and availability, using current data. [Phase 1; UC-28]
- FR-IV-05 Stock ageing. The system shall show for every vehicle the number of days in stock
  and group vehicles in ageing ranges set in the system settings. [SRDS marks it Later; the
  plan moves it in; UC-28]
- FR-NT-04 Scheduled jobs. The system shall run scheduled jobs to expire sell requests,
  bookings and unconfirmed appointments and to send follow-up reminders. [Phase 1; UC-39]
- Proposal: ageing groups 0 to 30, 31 to 60, 61 to 90 and over 90 days, kept in LIMITS.AGEING_DAYS.

## 10. Notifications
- FR-NT-01 In-app notifications. The system shall create an in-app notification for the events
  listed in the Notification Events table in Section 3.1.12 and shall show the unread count. A
  user shall be able to mark one or all notifications as read. [Phase 1; UC-04]
- FR-NT-02 Email notifications. The system shall send emails for the events marked as email in
  the Notification Events table in Section 3.1.12. A failure to send an email shall be logged
  and shall not stop the user action. [Phase 1; UC-04]
Table 3.1 of the SRDS, rows of Phase 1 (event, recipient, in-app, e-mail):
- Sell request submitted: Branch Manager of the branch. In-app yes, e-mail yes.
- Sell request accepted or rejected: Customer. In-app yes, e-mail yes.
- Sell request expired: Customer. In-app yes, e-mail yes.
- Inspection submitted: Branch Manager. In-app yes, e-mail no.
- Inspection approved, returned or rejected: Inspector. In-app yes, e-mail no.
- Vehicle listed (Ready for Sale): Customer who sold the vehicle. In-app yes, e-mail yes.
- Proposal: send "vehicle listed" when the car becomes Ready for Sale: at approval when no repairs are needed, at completion of the repairs when they are.

## 11. State tables (only the rows of the 35%)
Sell request (Table 5.6):
- start, customer submits, data valid: Pending
- Pending, manager accepts, manager of the branch: Accepted
- Pending, manager rejects, reason entered: Rejected
- Accepted, arrival recorded, not expired: Completed
- Accepted, time passed, expiry time reached and no arrival: Expired

Inspection (Table 5.7):
- start, inspection started, vehicle Received: Draft
- Draft, submit, all items answered, mileage entered, minimum photos: Submitted
- Submitted, approve, terms and selling price valid: Approved
- Submitted, return, remarks entered: Returned
- Submitted, reject vehicle, reason entered: Rejected
- Returned, resubmit, same checks as submit: Submitted

Vehicle (Table 5.5):
- start, arrival recorded, request Accepted and not expired or walk-in, unique numbers: Received (Sales Staff)
- Received, inspection started, vehicle of own branch: Under Inspection (Sales Staff)
- Under Inspection, approved, terms and price valid, no repairs needed: Ready for Sale (Branch Manager)
- Under Inspection, approved, terms and price valid, repairs needed (A-20): Reconditioning (Branch Manager)
- Under Inspection, rejected, reason entered: Rejected (Branch Manager)
- Reconditioning, work completed, manager confirms: Ready for Sale (Branch Manager)
- When an inspection is returned and resubmitted, the vehicle stays Under Inspection.
- Later (not built): Booked, Sold, Delivered.

## 12. Rules that shape the code
- NFR-SC-01 Every user except a visitor shall log in with email and password. Passwords shall
  be stored only as salted hashes made with a recommended password hashing algorithm and shall
  never be shown or logged.
- NFR-SC-02 Access shall be checked on the server by role and, for staff, by branch. Hiding a
  button in the screen shall not be the only protection.
- NFR-SC-04 Access tokens shall be short-lived. Refresh tokens shall be stored in an httpOnly
  cookie, shall be renewed on use and shall be cancelled on logout and when an old token is
  reused.
- NFR-SC-05 All input from the client shall be validated on the server for type, length and
  range. Database queries shall use parameters so that SQL injection is not possible.
- NFR-SC-06 Login, registration, password reset, upload, price estimate and chatbot requests
  shall be rate limited. Repeated failed logins may lock the account for a short time
  (assumption A-18).
- NFR-SC-07 Uploaded files shall be checked for size and real file type, renamed with random
  names and stored outside the program code folder.
- NFR-SC-08 Personal data of customers (name, phone, email, requests) shall be visible only to
  the customer and to staff who need it for their work. Public pages shall never show personal
  data or internal cost data.
- NFR-SC-09 Passwords, API keys and tokens of external services shall be kept in environment
  settings and not in source code or in the repository.
- NFR-SC-10 Price changes, status changes and changes to important records shall be stored in
  the activity log with user and time and shall not be editable from the application.
- NFR-SC-11 The database shall be backed up regularly and multi- step changes (for example
  approval of a vehicle) shall run in one transaction so that data is not left half-changed
  after a failure.
- A-18 A user is locked for a short time after five failed logins. (The lock time of 15 minutes is a Proposal.)
- NFR-RL-01 The system shall catch errors, show a clear message to the user, log the technical
  detail and continue to work for other users.
- NFR-RL-03 Changes that affect more than one table shall be all done or not done at all.
- NFR-CR-01 A record shall never be in a status that is not allowed. Invalid transitions shall
  be refused by the server.
- NFR-TS-01 Every service that changes a status shall have unit tests for the success case and
  the failure cases. The main business flow shall have an end-to-end test.
- NFR-MT-01 The server code shall follow the layers route, controller, service and repository.
  Business rules shall be only in services.
- NFR-MT-02 Each business area shall be a separate module so that it can be changed without
  changing others.
- NFR-MT-04 Database changes shall be made only through versioned migration files.
- NFR-MT-05 Values likely to change (expiry periods, slot length, ageing ranges, lead rules)
  shall be system settings and not written inside code.
- NFR-MT-06 Code shall follow one style guide, be checked by a linter and have comments only
  where the reason is not obvious.
- NFR-US-02 The public pages and the customer pages shall work on phone screens from 360
  pixels width. Staff pages shall work on a desktop screen and on a tablet.
- NFR-US-03 Buttons, status labels, messages and dialogs shall look and behave the same on all
  screens. Status shall be shown by text and not by colour alone.
- NFR-US-04 Pages shall have visible keyboard focus, readable contrast and labels for all form
  fields.
- NFR-PF-01 Public pages (browse and vehicle detail) should be usable within 3 seconds on a
  normal broadband connection with a typical vehicle list.
- NFR-PF-02 Common read requests (list, detail, filters) should answer within 1 second and
  write requests within 2 seconds under normal load, not counting file upload and AI calls.
- NFR-PF-03 Uploading one photo of up to 5 MB should complete within 15 seconds on a
  connection with an upload speed of at least 3 Mbps, and the user shall see upload progress.
- Note on NFR-MT-01: the plan merges route and controller. The handler of 3 to 5 lines inside the routes file is the controller. Open: ask the supervisor if a separate controller file is wanted.

## 13. Decisions taken by the plan (Proposal, not SRDS)
- Access token 15 minutes. Refresh token 7 days. bcrypt cost 12. Password 8 to 72 characters with a letter and a number. Reset link valid 60 minutes.
- At most 10 files per upload request. Only JPG and PNG, up to 5 MB, checked by the first bytes of the file.
- Rate limit on the auth paths: at most 20 requests per window.
- The inspection checklist of 24 items. The table inspection_events.
