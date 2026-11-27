# Acceptance cases (AT-01 to AT-40)

The manual test script for the demo, and the base of the browser tests and of the testing chapter in the report.
Every case points to the SRDS rule it checks. Run all of them by hand before the demo (slice S9). Each case also needs an automated test where the slice file says so.

The column Slice says in which slice the case is built and first tested.

| ID | Slice | Case | Expected result | Rule |
|---|---|---|---|---|
| AT-01 | S2 | Register with valid data | Account is created as Customer and logged in | FR-AU-01 |
| AT-02 | S2 | Register with an e-mail that exists | Clear message, no second account | FR-AU-01 |
| AT-03 | S2 | Log in with a wrong password, then with an unknown e-mail | The same general message both times | FR-AU-02 |
| AT-04 | S2 | Five wrong passwords in a row | The account is blocked for a while | A-18 |
| AT-05 | S2 | Reload the page after login | Still logged in | FR-AU-03 |
| AT-06 | S2 | Log out, then try to refresh | Refused | FR-AU-03 |
| AT-07 | S2 | Use a reset link twice | First works, second is refused | FR-AU-04 |
| AT-08 | S2 | Change password with a wrong old password | Refused | FR-AU-05 |
| AT-09 | S2 | Customer opens a staff address | Refused | FR-AU-06 |
| AT-10 | S3 | Send a sell request with all fields | Status Pending; the branch manager is notified | FR-CU-11 |
| AT-11 | S3 | Send a sell request with a year in the future | Field error, nothing saved | Shared schema |
| AT-12 | S3 | Manager of the branch accepts a request | Accepted; the customer is notified | FR-BM-01 |
| AT-13 | S3 | Manager of another branch tries the same | Refused | FR-AU-07 |
| AT-14 | S3 | Reject without a reason | Refused | FR-BM-01 |
| AT-15 | S3 | Staff record arrival for an accepted request | Vehicle is Received; request is Completed | FR-SS-01 |
| AT-16 | S3 | Record arrival with a registration number already used | Friendly message; nothing saved | FR-AC-05 |
| AT-17 | S4 | Start an inspection | Vehicle becomes Under inspection | FR-IN-01 |
| AT-18 | S4 | Submit with one item missing | The form lists what is missing | FR-IN-06 |
| AT-19 | S4 | Upload a text file renamed to `.jpg` | Refused | FR-IN-05 |
| AT-20 | S4 | Submit a complete inspection | Submitted; the manager is notified | FR-IN-06 |
| AT-21 | S5 | Manager returns it with remarks | Staff see the remarks and can edit again; the history keeps them | FR-BM-02, FR-IN-08 |
| AT-22 | S5 | Manager approves with a purchase price and a selling price | Vehicle is Ready for sale; acquisition is saved | FR-BM-02, FR-BM-03, FR-AC-04 |
| AT-23 | S5 | Sales staff try to change the price | Refused | FR-SS-03 |
| AT-24 | S7 | Open the public list | Only Ready for sale cars, each with a cover photo | FR-CU-01 |
| AT-25 | S7 | Filter by make and price range, then reload | The filters are in the address and still applied | FR-CU-02 |
| AT-26 | S7 | Open a car page and look at the answer from the server | No purchase price, commission or manager remarks | FR-CU-04 |
| AT-27 | S7 | Open the inspection report and print it | The approved results show; the print is clean | FR-CU-05, FR-IN-07 |
| AT-28 | S5 | Delete a listing | It leaves the public list; a history row exists | FR-SS-04 |
| AT-29 | S5 | Open the history of a vehicle | Every status change shows user and time | FR-AC-03 |
| AT-30 | S5 | Approve an inspection and tick "needs repairs" | Vehicle is Reconditioning and is not in the public list | A-20, FR-AC-06 |
| AT-31 | S6 | Add a repair item with an amount of zero | Refused, the rule is shown | FR-AC-07 |
| AT-32 | S6 | Add two repair items | The list shows both and the total is their sum | FR-AC-07 |
| AT-33 | S6 | Mark the repair work complete | Vehicle is Ready for sale, appears in the public list; the seller is notified | FR-AC-06 |
| AT-34 | S6 | Mark complete when no repair item is saved | The system asks to confirm that no work was needed | UC-27 |
| AT-35 | S8 | Manager opens the inventory | Vehicles of all branches with status and branch | FR-IV-01, FR-BM-06 |
| AT-36 | S8 | Filter the inventory by branch, status and make | Only matching vehicles; a clear message when none match | UC-28 |
| AT-37 | S8 | Check days in stock and ageing group of a car received 45 days ago | 45 days, group 31 to 60 | FR-IV-05 |
| AT-38 | S8 | Run the expiry job when a request was accepted more than 7 days ago | Request is Expired; the customer is notified in the app and by e-mail | A-03, FR-NT-04 |
| AT-39 | S8 | Run the expiry job a second time | Nothing changes; no second notification | FR-NT-04 |
| AT-40 | S8 | Record arrival for an expired request | Refused with a clear message | FR-BM-01 |

## Browser journeys (five to eight, one per main story; slice S9)

1. Register, log in, log out.
2. Customer sends a request; manager accepts; staff record arrival (log in through the API for speed).
3. Staff fill and submit an inspection with photos.
4. Manager approves a car with repairs, adds a repair cost and completes the work; the car then shows in the public list.
5. Public filters change the address and survive a reload.
6. The login form can be used with the keyboard only.
7. Manager opens the inventory and filters it by branch.

Tips: find elements the way a person does (by role, label and visible text); log in through the API except in the login test; do not test colours and spacing in these tests.
