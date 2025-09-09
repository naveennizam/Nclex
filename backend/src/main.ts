import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
 
  app.use(cookieParser());
  app.enableCors({
    origin: 'https://nclex-mc31.onrender.com', 
  //  origin: configService.get<string>('Frontend_Domain') || 'https://nclex-mc31.onrender.com', // ✅ MUST be exact origin
    credentials: true, // ✅ Required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // ✅ fine
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
const port = process.env.PORT || 8080;
   await app.listen(process.env.PORT ?? 8080);
   console.log(`🚀 App listening on port ${port}`);
}
bootstrap();
