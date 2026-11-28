import bcrypt from 'bcryptjs';
import { ROLE } from '@v360/shared/constants';

// Development only. This password is written in the README on purpose: it protects nothing real.
const DEMO_PASSWORD = 'Vehicle360demo';
const BCRYPT_COST = 12;

async function getDatabaseName(knex) {
  const result = await knex.raw('SELECT current_database() AS name');
  return result.rows[0].name;
}

async function refuseOutsideDevelopment(knex) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The demo seed never runs in production.');
  }
  if ((await getDatabaseName(knex)).endsWith('_test')) {
    throw new Error('The demo seed never runs on a test database: the tests make their own data.');
  }
}

export async function seed(knex) {
  await refuseOutsideDevelopment(knex);

  // Start from empty tables, so the seed can run twice in a row.
  await knex.raw('TRUNCATE branches, users RESTART IDENTITY CASCADE');

  // Placeholder names until AK Motors gives the real ones.
  const branches = await knex('branches')
    .insert([
      { name: 'Branch 1', city: 'Wah Cantt', address: 'Placeholder address 1' },
      { name: 'Branch 2', city: 'Rawalpindi', address: 'Placeholder address 2' },
      { name: 'Branch 3', city: 'Islamabad', address: 'Placeholder address 3' },
    ])
    .returning('id');
  const [branch1, branch2] = branches.map((branch) => branch.id);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_COST);
  await knex('users').insert(
    [
      { name: 'Admin', email: 'admin@vehicle360.test', role: ROLE.ADMIN },
      {
        name: 'Manager Branch 1',
        email: 'manager1@vehicle360.test',
        role: ROLE.BRANCH_MANAGER,
        branch_id: branch1,
      },
      {
        name: 'Staff Branch 1',
        email: 'staff1@vehicle360.test',
        role: ROLE.SALES_STAFF,
        branch_id: branch1,
      },
      {
        name: 'Staff Branch 2',
        email: 'staff2@vehicle360.test',
        role: ROLE.SALES_STAFF,
        branch_id: branch2,
      },
      {
        name: 'Demo Customer',
        email: 'customer@vehicle360.test',
        role: ROLE.CUSTOMER,
        phone: '03001234567',
      },
    ].map((user) => ({ ...user, password_hash: passwordHash })),
  );
}
