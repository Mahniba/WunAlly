export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ApiError) {
    if (typeof error.data === 'object' && error.data !== null) {
      const record = error.data as Record<string, unknown>;
      if (typeof record.detail === 'string') return record.detail;
      const firstKey = Object.keys(record)[0];
      const firstVal = record[firstKey];
      if (Array.isArray(firstVal) && typeof firstVal[0] === 'string') {
        return firstVal[0];
      }
      if (typeof firstVal === 'string') return firstVal;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
