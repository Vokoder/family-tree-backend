import express, { json, urlencoded } from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import { router } from '#modules/route.ts';
import { CORS_ORIGIN, PORT } from '#app.config.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware, httpErrorMiddleware, typeErrorMiddleware } from '#shared/middleware/errors.middleware.ts';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Swagger configuration
const schemaPath = path.join(__dirname, '../docs/openapi.yml');
const openapi = YAML.load(schemaPath);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.get('/openapi.json', (_req, res) => res.json(openapi));

// Middlewares
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'http://localhost', 'ws://localhost'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
  }),
);
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use('/', router);

//обработка ошибок
app.use(httpErrorMiddleware);
app.use(errorMiddleware);
app.use(typeErrorMiddleware);

app.listen(PORT);
