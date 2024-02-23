type ResponseConstructorType = {
  statusCode?: number;
  message?: string | string[];
  data?: any;
};

export class ResponseBuilder<T extends object = any> {
  private statusCode: number;
  private message: string | string[];
  private data: T;

  constructor(args?: ResponseConstructorType) {
    this.statusCode = args?.statusCode || 200;
    this.message = args?.message || 'Success';
    this.data = args?.data;
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
