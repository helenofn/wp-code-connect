/**
 * The e2e tests use their own database, created by
 * docker/postgres/init/01-create-test-db.sql, so they never touch dev data.
 */
export const E2E_DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  'postgres://codeconnect:codeconnect@localhost:5432/code_connect_test';
