import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { configuration, showBanner } from './config/configuration';
import { HttpExceptionFilter } from './filter/http.exception.filter';

const bootstrap = async () => {
  showBanner();

  const app = await NestFactory.create(AppModule);

  app.use(morgan(':date[iso] :method :url :header :param :query :body :statusCode'));

  morgan.token('header', (req) => {
    return 'headers: ' + JSON.stringify(req.headers);
  });

  morgan.token('param', (req) => {
    return 'params: ' + JSON.stringify(req.params);
  });

  morgan.token('query', (req) => {
    return 'query: ' + JSON.stringify(req.query);
  });

  morgan.token('body', (req) => {
    return 'body: ' + JSON.stringify(req.body);
  });

  morgan.token('statusCode', (req, res) => {
    return 'statusCode: ' + res.statusCode;
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  const server = configuration['server'];

  app.setGlobalPrefix(server.path);

  const swagger = configuration['swagger'];

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setContact(swagger.contact.name, swagger.contact.url, swagger.contact.email)
    .setLicense(swagger.license.name, swagger.license.url)
    .setVersion(swagger.version)
    .addServer(`http://localhost:${server.port}`, 'Development Server')
    .addServer(`https://node-nestjs.onrender.com`, 'Production Server')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swagger.path, app, swaggerDocument);

  await app.listen(server.port, () => {
      console.log(`Server is listening on http://localhost:${server.port}${server.path}`);
  });
}

bootstrap();