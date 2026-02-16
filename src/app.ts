import express, { json, urlencoded } from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import { router } from '#modules/route.ts';
import { CORS_ORIGIN, PORT } from '#app.config.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware, httpErrorMiddleware, typeErrorMiddleware } from '#shared/middleware/errors.middleware.ts';

const app = express();

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
