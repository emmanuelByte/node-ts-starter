/* eslint-disable @typescript-eslint/no-explicit-any */
// src/helpers/routeWrapper.ts
import { NextFunction, Request, Response } from 'express';

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

function isControllerMethod(fn: unknown): fn is ControllerMethod {
  return typeof fn === 'function';
}

export default function routeWrapper<T>(controller: T): T {
  const wrappedController: any = {};

  const methodNames = new Set([
    ...Object.getOwnPropertyNames(controller),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(controller)),
  ]);

  for (const key of methodNames) {
    const method = (controller as any)[key];
    if (isControllerMethod(method)) {
      wrappedController[key] = (req: Request, res: Response, next: NextFunction) => method(req, res, next);
    } else {
      wrappedController[key] = method;
    }
  }

  return wrappedController as T;
}
