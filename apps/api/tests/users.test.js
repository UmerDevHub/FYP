// An example for later slices: make the data with the helpers, then check one rule.
import { describe, expect, it } from 'vitest';
import { makeBranch, makeUser, testDb } from './helpers.js';

describe('users and branches in the test database', () => {
  it('makeUser saves a sales staff member of a branch', async () => {
    const branch = await makeBranch();

    const user = await makeUser('sales_staff', branch.id);

    expect(user.role).toBe('sales_staff');
    expect(user.branchId).toBe(branch.id);
  });

  it('the database refuses sales staff without a branch', async () => {
    await expect(makeUser('sales_staff')).rejects.toThrow('users_branch_matches_role');

    const staffCount = await testDb('users').where({ role: 'sales_staff', branchId: null }).count();
    expect(Number(staffCount[0].count)).toBe(0);
  });
});
