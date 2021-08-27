/**
 * Thrown when a GET request returns an error response code,
 * instead of a 200 OK + JSON body that can be mapped to a TS model.
 */
export class NonOkResponseError extends Error {
  private readonly errorCode: number;

  /**
   * Instantiates a new instance of @see NonOkResponseError .
   *
   * @param message Error message.
   * @param errorCode HTTP Response error code.
   */
  constructor(message: string, errorCode: number) {
    super(message);
    this.name = "NonOkResponseError";
    this.errorCode = errorCode;
  }

  /**
   * Gets the HTTP Response error code associated with the @see NonOkResponseError .
   */
  get httpErrorCode(): number {
    return this.errorCode;
  }
}
