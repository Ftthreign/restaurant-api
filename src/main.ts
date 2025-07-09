import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  const swaggerInit = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('Dokumentasi Restaurant API')
    .setVersion('1.0')
    .addTag('Default Endpoint')
    .addTag('Users')
    .addTag('Authentication')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerInit);

  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log(`Application running on http://localhost:${port}`);
}
bootstrap();
