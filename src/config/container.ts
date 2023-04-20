// src/config/container.ts
import { createContainer, asClass, AwilixContainer } from 'awilix';
import { UserRepository } from '../infra/repository/userRepository';
import UserService from '../services/userService';

export function configureContainer(): AwilixContainer {
  const container = createContainer();

  container.register({
    userService: asClass(UserService).singleton(),
    userRepository: asClass(UserRepository).singleton(),
  });

  return container;
}
