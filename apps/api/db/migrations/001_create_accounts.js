import { ROLES } from '@v360/shared/constants';

// S1: the six tables every later slice needs. Plain SQL, so each rule is easy to read.
const roleList = ROLES.map((role) => `'${role}'`).join(', ');

export async function up(knex) {
  await knex.raw(`
    CREATE TYPE user_role AS ENUM (${roleList});

    CREATE TABLE branches (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name text NOT NULL UNIQUE,
      city text NOT NULL,
      address text NOT NULL,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE users (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      password_hash text NOT NULL,
      role user_role NOT NULL DEFAULT 'customer',
      branch_id bigint REFERENCES branches (id),
      failed_logins integer NOT NULL DEFAULT 0,
      locked_until timestamptz,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      -- Sales staff and managers must have a branch; customers and admins have none.
      CONSTRAINT users_branch_matches_role CHECK (
        (role IN ('sales_staff', 'branch_manager')) = (branch_id IS NOT NULL)
      )
    );
    -- One account per e-mail address, whatever the letter case.
    CREATE UNIQUE INDEX users_email_unique ON users (lower(email));

    CREATE TABLE refresh_tokens (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      token_hash text NOT NULL UNIQUE,
      family_id uuid NOT NULL,
      expires_at timestamptz NOT NULL,
      revoked_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE password_resets (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      token_hash text NOT NULL UNIQUE,
      expires_at timestamptz NOT NULL,
      used_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE notifications (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      title text NOT NULL,
      message text NOT NULL,
      link text,
      is_read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- user_id is empty when the system itself acts (the expiry job).
    CREATE TABLE activity_logs (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id bigint REFERENCES users (id),
      action text NOT NULL,
      entity_type text NOT NULL,
      entity_id bigint,
      old_value jsonb,
      new_value jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE activity_logs;
    DROP TABLE notifications;
    DROP TABLE password_resets;
    DROP TABLE refresh_tokens;
    DROP TABLE users;
    DROP TABLE branches;
    DROP TYPE user_role;
  `);
}
