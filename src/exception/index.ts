interface BaseErrorImpl {
  code: number;
  reason: string;
}

abstract class BaseException extends Error implements BaseErrorImpl {
  abstract code: number;
  abstract reason: string;

  constructor() {
    super();
  }
}

export class LogicalException extends BaseException {
  code = 500;
  reason = "Logical Fault Exception";

  constructor(message?: string) {
    super();

    if (message) this.reason = `${this.reason}, ${message}`;
  }
}

export class TypeException extends BaseException {
  code = 500;
  reason = "Invalid Type";

  constructor(message?: string) {
    super();

    if (message) this.reason = `${this.reason}, ${message}`;
  }
}
