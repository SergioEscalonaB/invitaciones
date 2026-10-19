-- Rotate every legacy, human-readable invitation identifier.
-- Existing shared links intentionally stop working after this migration.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE "Invitation"
SET "token" = rtrim(
  translate(encode(gen_random_bytes(32), 'base64'), '+/', '-_'),
  '='
);
