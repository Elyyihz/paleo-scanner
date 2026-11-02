/**
 * Development application environment configuration.
 *
 * Explicitly binds to IPv4 loopback (127.0.0.1) to avoid port collision
 * with background Docker services listening on macOS IPv6 (localhost / ::1).
 */
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api/v1',
  staticBaseUrl: 'http://127.0.0.1:8000',
};
