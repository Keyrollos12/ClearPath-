export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class forbiddenException extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

export class conflictException extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

export class internalServerError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}