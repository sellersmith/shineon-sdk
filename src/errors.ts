export class ShineOnError extends Error {
  public readonly status: number;
  public readonly responseBody: unknown;

  constructor(message: string, status: number, responseBody?: unknown) {
    super(message);
    this.name = 'ShineOnError';
    this.status = status;
    this.responseBody = responseBody;
  }
}
