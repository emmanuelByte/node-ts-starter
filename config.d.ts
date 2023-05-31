declare module 'config' {
  export interface DbConfig {
    url: string;
  }

  export interface JwtConfig {
    secret: string;
    expiresIn: string;
  }

  export interface AppConfig {
    port: number;
    env: string;
  }

  export interface Config {
    db: DbConfig;
    jwt: JwtConfig;
    app: AppConfig;
  }

  const config: Config;
  export default config;
}
