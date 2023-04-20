import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = ReasonPhrases.BAD_REQUEST) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = ReasonPhrases.NOT_FOUND) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
