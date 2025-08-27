import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
 
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('Frontend_Domain'), // your Next.js frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // optional: if you send cookies/auth headers
  });


  const allowedOrigins = ['http://localhost:3000','http://192.168.100.14:3000'];
  
// app.enableCors({
//   origin: (origin, callback) => {
   
//     if (!origin || allowedOrigins.includes(origin)) {
   
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // ✅ enable credentials here
// });

   await app.listen(process.env.PORT ?? 8080);
  
}
bootstrap();
