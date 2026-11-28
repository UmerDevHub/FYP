import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { makeBranch } from './helpers.js';

describe('GET /api/branches', () => {
  it('returns the active branches for the sell request form', async () => {
    await makeBranch({ name: 'Branch 1' });
    await makeBranch({ name: 'Branch 2' });
    await makeBranch({ name: 'Branch 3' });
    await makeBranch({ name: 'Closed branch', isActive: false });

    const response = await request(createApp()).get('/api/branches');

    expect(response.status).toBe(200);
    expect(response.body.data.map((branch) => branch.name)).toEqual([
      'Branch 1',
      'Branch 2',
      'Branch 3',
    ]);
  });

  it('does not return an inactive branch', async () => {
    const response = await request(createApp()).get('/api/branches');

    expect(response.body.data.map((branch) => branch.name)).not.toContain('Closed branch');
  });

  it('returns only id, name and city: no private column', async () => {
    const response = await request(createApp()).get('/api/branches');

    for (const branch of response.body.data) {
      expect(Object.keys(branch).sort()).toEqual(['city', 'id', 'name']);
    }
  });
});
