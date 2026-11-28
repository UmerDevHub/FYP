import { INSPECTION_RESULTS, INSPECTION_STATUSES } from '@v360/shared/constants';

// S4: the checklist, inspections, their results, photos and the history of each inspection.
function toSqlList(words) {
  return words.map((word) => `'${word}'`).join(', ');
}

export async function up(knex) {
  await knex.raw(`
    CREATE TYPE inspection_status AS ENUM (${toSqlList(INSPECTION_STATUSES)});

    -- FR-IN-02: the standard checklist, grouped in categories (the items are in the seed).
    CREATE TABLE checklist_items (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      category text NOT NULL,
      name text NOT NULL,
      sort_order integer NOT NULL,
      is_active boolean NOT NULL DEFAULT true
    );

    CREATE TABLE inspections (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      vehicle_id bigint NOT NULL REFERENCES vehicles (id),
      inspector_id bigint NOT NULL REFERENCES users (id),
      mileage_km integer CHECK (mileage_km >= 0),
      documents_verified boolean NOT NULL DEFAULT false,
      document_notes text,
      damage_notes text,
      status inspection_status NOT NULL DEFAULT 'draft',
      submitted_at timestamptz,
      reviewed_by bigint REFERENCES users (id),
      reviewed_at timestamptz,
      review_remarks text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      -- A returned or rejected inspection has remarks (docs/data-model.md).
      CONSTRAINT inspections_decision_has_remarks CHECK (
        status NOT IN ('returned', 'rejected') OR review_remarks IS NOT NULL
      )
    );
    -- Only one open inspection per vehicle.
    CREATE UNIQUE INDEX inspections_one_open_per_vehicle ON inspections (vehicle_id)
      WHERE status IN ('draft', 'submitted', 'returned');
    -- The inspection queue of a branch filters by status.
    CREATE INDEX inspections_status ON inspections (status);

    -- FR-IN-02: one answer for each checklist item of an inspection.
    CREATE TABLE inspection_results (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      inspection_id bigint NOT NULL REFERENCES inspections (id) ON DELETE CASCADE,
      checklist_item_id bigint NOT NULL REFERENCES checklist_items (id),
      result text NOT NULL CHECK (result IN (${toSqlList(INSPECTION_RESULTS)})),
      remarks text,
      CONSTRAINT inspection_results_one_per_item UNIQUE (inspection_id, checklist_item_id)
    );

    -- FR-IN-05: photos with captions; the file is on disk, this row holds its path.
    CREATE TABLE inspection_photos (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      inspection_id bigint NOT NULL REFERENCES inspections (id) ON DELETE CASCADE,
      file_path text NOT NULL,
      caption text,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- FR-IN-08 (Proposal): every start, submit and decision, with the remarks, is kept.
    CREATE TABLE inspection_events (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      inspection_id bigint NOT NULL REFERENCES inspections (id) ON DELETE CASCADE,
      action text NOT NULL,
      user_id bigint REFERENCES users (id),
      remarks text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE inspection_events;
    DROP TABLE inspection_photos;
    DROP TABLE inspection_results;
    DROP TABLE inspections;
    DROP TABLE checklist_items;
    DROP TYPE inspection_status;
  `);
}
