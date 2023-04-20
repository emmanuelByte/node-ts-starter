# trade-vu

trade-vu is a Node.js application built using TypeScript, Express, and MongoDB. It features a dependency injection container (Awilix), authentication with bcrypt and JSON Web Tokens, and a focus on code quality with ESLint, Prettier, and Husky.

## Features

- Dependency injection with [Awilix](https://github.com/jeffijoe/awilix)
- Password hashing with [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- Cross-Origin Resource Sharing (CORS) support with [cors](https://github.com/expressjs/cors)
- Environment variable management with [dotenv](https://github.com/motdotla/dotenv)
- Securing Express app with [helmet](https://github.com/helmetjs/helmet)
- Data validation with [Joi](https://github.com/sideway/joi)
- Logging with [Morgan](https://github.com/expressjs/morgan)
- ORM for MongoDB with [Mongoose](https://github.com/Automattic/mongoose)

## Getting Started

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Create a `.env` file in the root of the project and configure your environment variables (refer to `.env.example` for guidance).

3. Build the project:

\`\`\`bash
npm run build
\`\`\`

4. Start the application:

\`\`\`bash
npm run start
\`\`\`

## Available Scripts

- `start`: Runs the compiled application.
- `start:pm2`: Starts the application with PM2 process manager.
- `dev`: Starts the development server with hot-reloading.
- `build`: Compiles the TypeScript source code.
- `test`: Runs the test suite using Mocha.
- `lint`: Lints the source code using ESLint.
- `format`: Formats the source code using Prettier.
- `prepare`: Sets up Husky for Git hooks.

## License

ISC
