export class ResponseBuilder<T extends object = any> {
  private statusCode: number;
  private message: string | string[];
  private data: T;

  constructor() {
    this.statusCode = 200;
    this.message = 'Success';
  }

  build() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }

  setStatusCode(status: number): this {
    this.statusCode = status;
    return this;
  }

  setMessage(message: string | string[]): this {
    this.message = message;
    return this;
  }

  setData(data: any): this {
    this.data = data;
    return this;
  }
}
