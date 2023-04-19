// src/domain/User.ts
export interface User {
  id: string;
  email: string;
  password: string;
}

export interface UserRepository {
  create(user: Omit<User, "id">): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
