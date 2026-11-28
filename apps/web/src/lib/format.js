// How the screens show money, dates and mileage. Every screen uses these three; none formats on its own.

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

// A-04: times are shown in the Pakistan time zone.
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Karachi',
});

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Karachi',
});

function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

// Money arrives from the API as text ("5400000.00"); it is only turned into a number to show it.
export function formatPrice(value) {
  if (isEmpty(value)) return '';
  return `Rs ${numberFormat.format(Number(value))}`;
}

export function formatDate(value) {
  if (isEmpty(value)) return '';
  return dateFormat.format(new Date(value));
}

export function formatMileage(value) {
  if (isEmpty(value)) return '';
  return `${numberFormat.format(Number(value))} km`;
}

// For things that happen at a moment, such as a notification: "14 March 2027 at 1:30 am".
export function formatDateTime(value) {
  if (isEmpty(value)) return '';
  return dateTimeFormat.format(new Date(value));
}
