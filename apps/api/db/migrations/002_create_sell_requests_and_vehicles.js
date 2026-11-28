import {
  FUEL_TYPES,
  SELL_REQUEST_STATUSES,
  TRANSMISSIONS,
  VEHICLE_STATUSES,
} from '@v360/shared/constants';

// S3: sell requests, vehicles, their photos and documents, and the vehicle status history.
function toSqlList(words) {
  return words.map((word) => `'${word}'`).join(', ');
}

export async function up(knex) {
  await knex.raw(`
    CREATE TYPE sell_request_status AS ENUM (${toSqlList(SELL_REQUEST_STATUSES)});
    CREATE TYPE vehicle_status AS ENUM (${toSqlList(VEHICLE_STATUSES)});

    CREATE TABLE sell_requests (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      customer_id bigint NOT NULL REFERENCES users (id),
      branch_id bigint NOT NULL REFERENCES branches (id),
      make text NOT NULL,
      model text NOT NULL,
      year integer NOT NULL,
      mileage_km integer NOT NULL CHECK (mileage_km >= 0),
      expected_price numeric(12, 2) NOT NULL CHECK (expected_price > 0),
      description text,
      status sell_request_status NOT NULL DEFAULT 'pending',
      decision_reason text,
      decided_by bigint REFERENCES users (id),
      decided_at timestamptz,
      expires_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      -- FR-BM-01: a rejection has a reason.
      CONSTRAINT sell_requests_rejection_has_reason CHECK (
        status <> 'rejected' OR decision_reason IS NOT NULL
      )
    );
    -- The staff list of a branch, the customer's own list, and the expiry job (S8).
    CREATE INDEX sell_requests_branch_status ON sell_requests (branch_id, status);
    CREATE INDEX sell_requests_customer ON sell_requests (customer_id);
    CREATE INDEX sell_requests_accepted_expiry ON sell_requests (expires_at) WHERE status = 'accepted';

    CREATE TABLE vehicles (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      sell_request_id bigint UNIQUE REFERENCES sell_requests (id),
      branch_id bigint NOT NULL REFERENCES branches (id),
      make text NOT NULL,
      model text NOT NULL,
      year integer NOT NULL,
      mileage_km integer NOT NULL CHECK (mileage_km >= 0),
      fuel_type text NOT NULL CHECK (fuel_type IN (${toSqlList(FUEL_TYPES)})),
      transmission text NOT NULL CHECK (transmission IN (${toSqlList(TRANSMISSIONS)})),
      colour text NOT NULL,
      registration_no text NOT NULL,
      chassis_no text NOT NULL,
      description text,
      status vehicle_status NOT NULL DEFAULT 'received',
      selling_price numeric(12, 2),
      received_at timestamptz NOT NULL DEFAULT now(),
      listed_at timestamptz,
      is_deleted boolean NOT NULL DEFAULT false,
      deleted_at timestamptz,
      deleted_by bigint REFERENCES users (id),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      -- A car that is for sale or sold has a selling price above zero.
      CONSTRAINT vehicles_listed_has_price CHECK (
        status NOT IN ('ready_for_sale', 'booked', 'sold', 'delivered') OR selling_price > 0
      )
    );
    -- FR-AC-05: no two vehicles that are not deleted share a registration or chassis number.
    CREATE UNIQUE INDEX vehicles_registration_unique ON vehicles (registration_no) WHERE NOT is_deleted;
    CREATE UNIQUE INDEX vehicles_chassis_unique ON vehicles (chassis_no) WHERE NOT is_deleted;

    CREATE TABLE vehicle_photos (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      vehicle_id bigint NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
      file_path text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0,
      is_cover boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- FR-AC-03: every status change with the old and new status, who and when.
    CREATE TABLE vehicle_status_history (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      vehicle_id bigint NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
      from_status vehicle_status,
      to_status vehicle_status NOT NULL,
      changed_by bigint REFERENCES users (id),
      note text,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- Table only: no screen in the 35% (Proposal in docs/data-model.md).
    CREATE TABLE vehicle_documents (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      vehicle_id bigint NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
      doc_type text NOT NULL,
      file_path text NOT NULL,
      is_verified boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE vehicle_documents;
    DROP TABLE vehicle_status_history;
    DROP TABLE vehicle_photos;
    DROP TABLE vehicles;
    DROP TABLE sell_requests;
    DROP TYPE vehicle_status;
    DROP TYPE sell_request_status;
  `);
}
