// The 24 checklist items in 6 categories (Proposal: the SRDS does not list them; AK Motors may
// change them). Exterior 6, Engine 5, Transmission and brakes 3, Suspension and steering 3,
// Interior 5, Electrical 2.
const CHECKLIST = {
  Exterior: [
    'Body panels and dents',
    'Paint and repaint',
    'Windscreen and glass',
    'Lights and indicators',
    'Tyres and wheels',
    'Doors, boot and locks',
  ],
  Engine: [
    'Engine start and idle',
    'Oil leaks',
    'Coolant and radiator',
    'Belts and hoses',
    'Exhaust smoke',
  ],
  'Transmission and brakes': ['Gear change', 'Clutch or automatic shifting', 'Brakes'],
  'Suspension and steering': ['Suspension and shocks', 'Steering', 'Wheel alignment'],
  Interior: [
    'Seats and upholstery',
    'Dashboard and gauges',
    'Air conditioning',
    'Windows and mirrors',
    'Odometer working',
  ],
  Electrical: ['Battery', 'Electrical accessories'],
};

export async function seed(knex) {
  // Start from an empty list, so the seed can run twice in a row.
  await knex.raw('TRUNCATE checklist_items RESTART IDENTITY CASCADE');

  const rows = [];
  for (const [category, names] of Object.entries(CHECKLIST)) {
    for (const name of names) {
      rows.push({ category, name, sort_order: rows.length + 1 });
    }
  }
  await knex('checklist_items').insert(rows);
}
