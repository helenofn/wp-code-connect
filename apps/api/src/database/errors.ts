const UNIQUE_VIOLATION = '23505';

/**
 * Name of the unique constraint a write violated, or undefined for any other
 * error. Drizzle wraps driver errors, so the pg error may be the `cause`.
 */
export function uniqueViolation(error: unknown): string | undefined {
  for (let e = error; e instanceof Error; e = e.cause) {
    const { code, constraint } = e as { code?: unknown; constraint?: unknown };
    if (code === UNIQUE_VIOLATION) {
      return typeof constraint === 'string' ? constraint : '';
    }
  }
  return undefined;
}
