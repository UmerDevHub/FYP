import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createApp } from '../src/app.js';
import { ApiError } from '../src/lib/ApiError.js';
import { errorHandler, notFound } from '../src/middleware/errorHandler.js';
import { validate } from '../src/middleware/validate.js';

// A small app with one route per kind of error, wired like the real app.
function createTestApp() {
  const app = express();
  app.use(express.json());
  const yearSchema = z.object({ year: z.number().int().min(1990, 'Enter a year from 1990.') });
  app.post('/check-year', validate(yearSchema), (req, res) => res.json({ data: req.valid.body }));
  app.get('/expected-problem', () => {
    throw new ApiError(409, 'This sell request is no longer pending.');
  });
  app.get('/unexpected-problem', () => {
    throw new Error('connection to table vehicles failed at C:\\secret\\path');
  });
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

afterEach(() => vi.restoreAllMocks());

describe('error answers all have the shape { error: { message, details } }', () => {
  it('a validation error gives 400 with the field details', async () => {
    const response = await request(createTestApp()).post('/check-year').send({ year: 1980 });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBeTypeOf('string');
    expect(response.body.error.details).toEqual({ year: ['Enter a year from 1990.'] });
  });

  it('valid input reaches the route as clean values in req.valid', async () => {
    const response = await request(createTestApp()).post('/check-year').send({ year: 2020 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { year: 2020 } });
  });

  it('an ApiError gives its own status and message', async () => {
    const response = await request(createTestApp()).get('/expected-problem');

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: { message: 'This sell request is no longer pending.', details: null },
    });
  });

  it('an unknown error gives 500 with a generic message; the real error goes only to the log', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(createTestApp()).get('/unexpected-problem');

    expect(response.status).toBe(500);
    expect(response.text).not.toContain('vehicles');
    expect(response.text).not.toContain('secret');
    expect(response.body.error.details).toBeNull();
    expect(log).toHaveBeenCalled();
  });

  it('a body that is not valid JSON gives 400, not 500', async () => {
    const response = await request(createTestApp())
      .post('/check-year')
      .set('Content-Type', 'application/json')
      .send('{"year": 20');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('The request body is not valid JSON.');
  });

  it('a route that does not exist gives 404 in the same shape', async () => {
    const response = await request(createApp()).get('/api/no-such-route');

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBeTypeOf('string');
    expect(response.body.error.details).toBeNull();
  });
});
