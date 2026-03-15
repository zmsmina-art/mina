import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!_sql) {
    const url = process.env.DASHBOARD_DATABASE_URL;
    if (!url) throw new Error('DASHBOARD_DATABASE_URL is not set');
    _sql = neon(url);
  }
  return _sql;
}
