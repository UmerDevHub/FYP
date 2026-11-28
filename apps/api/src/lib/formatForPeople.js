// How the server writes a date inside a message, such as a notification. A-04: Pakistan time.
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Karachi',
});

export function formatDateForPeople(date) {
  return dateFormat.format(new Date(date));
}
