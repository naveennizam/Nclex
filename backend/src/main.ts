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
// origin: configService.get<string>('Frontend_Domain') , // ✅ MUST be exact origin
    credentials: true, // ✅ Required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  });
  
   await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
