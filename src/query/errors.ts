import { ResponseData } from './response';

export class TimeoutError extends Error {}

export class ResponseError extends Error {
  public response: ResponseData;

  public code: string | number;

  constructor(message: string, response: ResponseData) {
    super(message);
    this.response = response;
    this.code = response.status;
  }
}
