# Node NestJS

Proyecto Node + NestJS + Axios + Morgan + Test Unitarios (jest) + Test de Aceptación (cucumber) + Test de Rendimiento (artillery/jmeter) + Reporte de Cobertura (jest)

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

**Clonar mediante SSH**
```shell
git clone git@github.com:byron-villegas/node-nestjs.gitS
```
**Clonar mediante HTTPS**
```shell
git clone https://github.com/byron-villegas/node-nestjs.git
```

Mira Deployment para conocer como desplegar el proyecto.

### Pre-requisitos 📋

_Que cosas necesitas para instalar el software y como instalarlas_

| Software | Versión  |
|----------|----------|
| node     | v16.17.0 |
| npm      | 8.15.0   |

#### Instalar Node

Para instalar Node debemos ir a la siguiente pagina: https://nodejs.org/en/download/ descargar el instalador, ejecutarlo y seguir los pasos para la instalación.

### Instalación 🔧

_Una serie de ejemplos paso a paso que te dice lo que debes ejecutar para tener un entorno de desarrollo ejecutandose_

Instalar las dependencias declaradas en el **package.json** mediante el siguiente comando:

```shell
npm install
```
**NOTA:** Node instalara todas las depedencias necesarias incluyendo las de desarrollo (test unitarios, test de aceptación, etc).

Instalación de dependencias finalizada mostrando el siguiente resultado en consola:

```shell
added 1296 packages, and audited 1297 packages in 35s

132 packages are looking for funding
  run `npm fund` for details

43 vulnerabilities (1 low, 16 moderate, 23 high, 3 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

_Finaliza con un ejemplo de cómo obtener datos del sistema o como usarlos para una pequeña demo_

[Ver Demo ↗️](https://node-nestjs.onrender.com/api/productos)

Para desplegar la aplicación tenemos las siguientes formas:

Por defecto:

```shell
npm start
```
**NOTA:** Si se realiza un cambio a la aplicación no se reiniciará automáticamente.

Con Nest Watch:

```shell
npm run start:dev
```
**NOTA:** La aplicación se correra mediante nest watch (cualquier cambio realizado en un archivo ts,json hará que la aplicación se refresque automáticamente).

La aplicación se desplegará exitosamente mostrando el siguiente resultado en consola:

```shell
Server is listening on http://localhost:3000/api
```

## Docker 🐋
A continuacion dejo los comandos a utilizar para generar la imagen y posteriormente ejecutarla

### Imagen
Para generar la imagen debemos utilizar el siguiente comando

```shell
docker build -t node-nestjs .
```

### Ejecutar
Para ejecutar la imagen debemos utilizar el siguiente comando

```shell
docker run -p 3000:3000 node-nestjs
```

## Exception Filter 🚏
Un exception filter es una función se ejecuta al momento de un error no controlado. esta funcion permite retornar una respuesta adecuada y fácil de usar.

### Casos de Uso
Los principales casos de uso para los exception filter son:

- Manejo de tipos de errores
- Control de errores

### Http Exception Filter
Podemos construir nuestro propio Http Exception Filter el cual se encargará de controlar las excepciones de la aplicación y devolver una respuesta adecuada.

#### Ejemplo
```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(httpException: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = httpException.getStatus();
    const responseBody = httpException.getResponse();

    response.status(status).json(responseBody);
  }
}
```
Como podemos ver la anotacion **@Catch** indica que tipo de excepcion deseamos capturar en este caso le pusimos **Error** para que capture todas

#### Uso
Para usar el Http Exception FIlter debemos importarlo y usarlo en nuestro App Module.

##### Ejemplo
```typescript
const bootstrap = async () => {
  showBanner();

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
}
```
Como podemos ver importamos el Http Exception Filter y solamente lo usamos, al hacer esto automáticamente se controlará las excepciones dentro de la aplicación.

## Guard 🚏
Los guards tienen una sola responsabilidad. Determinan si una solicitud determinada será manejada por el controlador de rutas o no, dependiendo de ciertas condiciones (como permisos, roles, ACL, etcétera) presentes en tiempo de ejecución

### Auth Guard
Podemos construir nuestro propio Auth Guard el cual se encargará de verificar que el token sea válido para consumir el servicio.

#### Ejemplo
```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        try {
            await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('authorization.secret') });
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers['authorization'];

        if(!authorization) {
            throw new UnauthorizedException();
        }

        const [type, token] = authorization.split(' ');

        if(!type || !token) {
            throw new UnauthorizedException();
        }
        
        if(!((type as string).toLowerCase() == 'bearer')) {
            throw new UnauthorizedException();
        }

        return token;
    }
}
```
Como podemos ver valida que el rol que venga en el token y tambien que sea valido.

#### Uso
Para usar el Authorize Guard debemos importarlo y usarlo en las rutas que nos interesa que sean consumidas con token.

##### Ejemplo
```javascript
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductoDTO } from './dto/producto.dto';
import { ProductoService } from './producto.service';
import { AuthGuard } from '../.././guard/auth.guard';

@ApiTags('productos')
@Controller('productos')
export class ProductoController {

    constructor(private productoService: ProductoService) { }

    @UseGuards(AuthGuard)
    @Post()
    save(@Body() producto: ProductoDTO) {
        this.productoService.save(producto);
    }
}
```
Como podemos ver se utiliza con la anotacion **@UseGuards** con la clase que deseamos usar.

## Ejecutando las pruebas ⚙️

_Explica como ejecutar las pruebas automatizadas para este sistema_

### Pruebas unitarias 📑

_Explica que verifican estas pruebas y por qué_

Los test unitarios son para comprobar que un fragmento de código determinado está funcionando de manera correcta, cabe destacar que si modificamos una funcionalidad toda prueba unitaria asociada a esa funcionalidad fallará si no es refactorizada debidamente.

#### Ejecución

Para ejecutar los test unitarios debemos utilizar el siguiente comando:

```shell
npm test
```
**NOTA:** Se ejecutarán todos los tests declarados en el directorio /test.

Para ejecutar los test unitarios con cobertura debemos utilizar el siguiente comando:

```shell
npm run test:cov
```

Los tests unitarios se ejecutarán exitosamente mostrando el siguiente resultado en consola:

```shell

> node-nestjs@1.0.0 test
> jest


 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts
 PASS  src/filter/http.exception.filter.spec.ts (6.383 s)

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts
 PASS  src/modules/info/info.module.spec.ts (6.348 s)

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts
 PASS  src/modules/auth/auth.service.spec.ts (6.454 s)

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/filter/http.exception.filter.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 RUNS  src/modules/auth/auth.service.spec.ts

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/modules/auth/auth.module.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 PASS  src/modules/info/info.controller.spec.ts (6.493 s)

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/modules/auth/auth.module.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 PASS  src/modules/producto/producto.controller.spec.ts (6.607 s)

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/modules/auth/auth.module.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 PASS  src/guard/auth.guard.spec.ts (6.579 s)

 RUNS  src/modules/health/health.controller.spec.ts
 RUNS  src/modules/auth/auth.module.spec.ts
 RUNS  src/modules/producto/producto.controller.spec.ts
 PASS  src/modules/health/health.module.spec.ts (6.634 s)
 PASS  src/modules/producto/producto.service.spec.ts (6.772 s)
 PASS  src/modules/auth/auth.controller.spec.ts (6.829 s)
 PASS  src/modules/health/health.controller.spec.ts (6.901 s)
 PASS  src/modules/producto/producto.module.spec.ts (6.914 s)
 PASS  src/modules/auth/auth.module.spec.ts
 PASS  src/app.module.spec.ts

# SI SE EJECUTA CON COBERTURA AGREGA ESTA SECCION ADICIONAL
=============================== Coverage summary ===============================
Statements   : 100% ( 246/246 )
Branches     : 100% ( 37/37 )
Functions    : 100% ( 41/41 )
Lines        : 100% ( 210/210 )
================================================================================

Test Suites: 13 passed, 13 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        7.691 s
Ran all test suites.
```
**NOTA:** Como resultado de los test unitarios se mostrará por consola los ejecutados y su tiempo, la cantidad, si pasaron de forma correcta o fallaron

##### Reporte de cobertura de los tests unitarios

![-----------------------------](/docs/img01.png)
**NOTA:** Como podemos ver estan los porcentajes correspondientes para las siguientes categorías: Statements, Branches, Functions y Lines

### Pruebas de aceptación ✅

_Explica que verifican estas pruebas y por qué_

Los test de aceptación son para probar las funcionalidades de la aplicación desde la perspectiva del cliente donde se evalúan las entradas y salidas.

#### Configuración

##### cucumber

_Herramienta utilizada para definir y ejecutar pruebas unitarias a partir de criterios de aceptación, fácilmente entendibles por todos los stakeholders directos/indirectos del proceso._

_Cabe destacar que cucumber genera un reporte de los tests ejecutados._

Para configurar cucumber utilizaremos el siguiente archivo:

###### cucumber.js

```javascript
module.exports = {
    default: {
        publishQuiet: true,
        parallel: 0,
        format: ['html:cucumber-report.html'],
        paths: ['acceptance-test/features/' + (process.env.npm_config_ambiente || 'dev')],
        require: ['acceptance-test/steps'],
        parameters: {
            HOST: process.env.npm_config_host || 'http://localhost',
            PORT: process.env.npm_config_port || 3000,
            CONTEXT_PATH: process.env.npm_config_context_path || '/api',
            AMBIENTE: process.env.npm_config_ambiente || 'dev'
        }
    }
}
```

###### Parametros

- publishQuiet: Flag para indicar si deseamos saltar la publicidad o no
- parallel: Número de ejecución de scenarios en paralelo
- format: Formato del reporte de cucumber
- paths: Directorios donde se encuentran los features /dev o /qa
- require: Directorios donde se encuentran los steps (implementaciones de los features)
- parameters: Parametros para los steps como: HOST, PORT, CONTEXT_PATH, AMBIENTE

#### Ejecución

##### Pre-condición

_La aplicación debe estar corriendo._

Para ejecutar los test de aceptación debemos utilizar el siguiente comando:

```shell
npm run test:acceptance
```
**NOTA:** Por defecto tomará la siguiente configuración: HOST=http://localhost PORT=3000 CONTEXT_PATH=/api AMBIENTE=dev

Para ejecutar los test de aceptación con configuraciones personalizadas debemos utilizar el siguiente comando:

```shell
npm run test:acceptance --HOST=http://localhost --PORT=3000 --CONTEXT_PATH=/api --AMBIENTE=dev
```
**NOTA:** Los parametros deben reflejar la configuración utilizada para correr la aplicación.

##### Parametros de ejecución

- HOST: Es la unión de **<span style="color:gold;">protocolo</span> + <span style="color:green;">subdominio</span> + <span style="color:blue;">dominio</span> + <span style="color:red;">tld</span>** quedando de la siguiente manera: **<span style="color:gold;">http://</span><span style="color:green;">www.</span><span style="color:blue;">localhost</span><span style="color:red;">.cl</span>**
- PORT: Es el puerto de la aplicación EJ.: 80, 8080, 3000
- CONTEXT_PATH: Es el path base de la aplicacion EJ.: /api
- AMBIENTE: Es el ambiente de los test a ejecutar (Los datos de pruebas no siempre son los mismos en diferentes ambientes) cada ambiente tiene su directorio de features /dev o /qa

Los tests de aceptación se ejecutarán exitosamente mostrando el siguiente resultado en consola:

```shell
.................................

11 scenarios (11 passed)
33 steps (33 passed)
0m00.070s (executing steps: 0m00.042s)
```
**NOTA:** Como resultado de los test de aceptación se generará un reporte de las pruebas realizadas en el archivo cucumber-report.html.

##### Reporte de los tests de aceptación

![-----------------------------](/docs/img02.png)
**NOTA:** Como podemos ver estan los feature definidos con sus respectivos scenarios.

### Pruebas de rendimiento 📈

_Explica que verifican estas pruebas y por qué_

Los test de rendimiento son para determinar el rendimiento de la aplicación bajo una carga de trabajo definida utilizando diferentes tipos de pruebas de rendimiento como pruebas de carga, estrés y estabilidad.

#### Herramientas

##### Artillery

_Artillery es un conjunto de herramientas de prueba de rendimiento moderno, potente y fácil de usar. Úselo para enviar aplicaciones escalables que mantienen su rendimiento y resistencia bajo una carga alta._

_Cabe destacar que Artillery genera un reporte de los tests ejecutados._

###### Configuración

Para configurar Artillery utilizaremos el siguiente archivo:

###### node-nestjs.yml

```yml
config:
  target: ""
  environments: # Ambientes
    qa:
      target: "{{ $processEnvironment.TARGET }}"
      phases:
    dev:
      target: "{{ $processEnvironment.TARGET }}"
    local:
      target: "http://localhost:3000/api"
  phases: # Las fases pueden ser dinamicas por ambientes
    - duration: 20 # Duracion en segundos
      arrivalRate: 10 # Cantidad de usuarios
  plugins:
    expect: {} # Carga por defecto los plugins instalados
  processor: "./processor.js" # Archivo por defecto para funciones personalizadas
  payload: # Carga previa de datos
    path: "./login.csv" # Utilizamos un login csv
    fields:
      - "username" # Obtenemos el username (se transforman en variables globales)
      - "password" # Obtenemos el password (se transforman en variables globales)
before: # Antes de ejecutar los scenarios
  flow:
    - log: "Obtener Token" # Log obtener token
    - post: # Metodo http
        url: "/auth" # Url del servicio
        json: # Formato del body
          username: "{{ username }}" # Usamos las variables globales
          password: "{{ password }}" # Usamos las variables globales
        capture: # Captura el resultado
          - json: "$.accessToken" # Formato del resultado .atributo
            as: "accessToken" # Nombre de la variable global
scenarios: # Lista de scenarios
  - name: "Autenticacion de usuario" # Nombre del scenario
    flow:
      - post: # Metodo http
          url: "/auth" # Url del servicio
          json: # Formato del body
            username: "{{ username }}" # Usamos las variables globales
            password: "{{ password }}" # Usamos las variables globales
          expect:
          - statusCode: 200
          - contentType: json
  - name: "Obtener usuarios"
    flow:
      - get: # Metodo http
          url: "/usuarios" # Url del servicio
          headers: # Headers personalizados
            authorization: "{{ accessToken }}" # Usamos la variable global
          expect:
          - statusCode: 200
          - contentType: json
  - name: "Obtener productos"
    flow:
      - get:
          url: "/productos"
          expect:
          - statusCode: 200
          - contentType: json
  - name: "Obtener producto mediante sku"
    flow:
      - get:
          url: "/productos/{{sku}}" # Usamos la variable generada por la funcion
          beforeRequest: obtenerSkuProducto # Funcion personalizada dentro del processor.js para obtener el sku de un producto de la lista de productos.json
          expect:
          - statusCode: 200
          - contentType: json
  - name: "Obtener productos ordenados por una propiedad"
    flow:
      - get:
          url: "/productos"
          qs: # Parametros query ?
            sort: "-precio" # parametro: valor
          expect:
          - statusCode: 200
          - contentType: json
  - name: "Filtrar productos por una propiedad"
    flow:
      - get:
          url: "/productos"
          qs:
            marca: "Nintendo"
          expect:
          - statusCode: 200
          - contentType: json
```

###### processor.js

```javascript
const productos = require('../../src/data/productos.json');

obtenerSkuProducto = (requestParams, ctx, ee, next) => {
    const producto = productos[0];
    ctx.vars['sku'] = producto.sku;
    return next();
}

module.exports = {
    obtenerSkuProducto,
};
```
**NOTA:** Con processor.js podemos definir funciones personalizadas para utilizarlas en el archivo de configuracion de Artillery.

###### Ejecución

**Pre-condición**

_La aplicación debe estar corriendo._

Para ejecutar los test de rendimiento debemos utilizar el siguiente comando:

```shell
npm run test:performance
```
**NOTA:** Por defecto ejecutará el ambiente local con el siguiente target: http://localhost:3000/api

Para ejecutar los test de rendimiento con un ambiente personalizado debemos utilizar los siguientes comandos:

```shell
export HOST="https://node-nestjs.onrender.com"
export PORT="443"
export CONTEXT_PATH="/api"
export TARGET="$HOST:$PORT$CONTEXT_PATH"
npx artillery run -e dev performance-test/artillery/node-nestjs.yml --output artillery-test.json
```
**NOTA:** Para que la url del target sea dinámica utilizamos $processEnvironment.TARGET el único inconveniente de Artillery es que debemos crear estas variables de entorno antes de ejecutar los test de rendimiento

###### Parametros de ejecución

- e: Environment que deseamos utilizar EJ.: local, dev, qa
- output: Archivo en el que deseamos almacenar el resultado de los test de rendimiento

Los tests de rendimiento se ejecutarán exitosamente mostrando el siguiente resultado en consola:

```shell
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
--------------------------------------
Metrics for period to: 23:10:40(-0400) (width: 3.064s)
--------------------------------------

http.codes.200: ................................................................ 32
http.request_rate: ............................................................. 18/sec
http.requests: ................................................................. 32
http.response_time:
  min: ......................................................................... 0
  max: ......................................................................... 2
  median: ...................................................................... 1
  p95: ......................................................................... 1
  p99: ......................................................................... 1
http.responses: ................................................................ 32
plugins.expect.ok: ............................................................. 64
plugins.expect.ok.contentType: ................................................. 32
plugins.expect.ok.statusCode: .................................................. 32
vusers.completed: .............................................................. 32
vusers.created: ................................................................ 32
vusers.created_by_name.Filtrar productos por una propiedad: .................... 8
vusers.created_by_name.Obtener producto mediante sku: .......................... 5
vusers.created_by_name.Obtener productos: ...................................... 7
vusers.created_by_name.Obtener productos ordenados por una propiedad: .......... 12
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 2.7
  max: ......................................................................... 17.4
  median: ...................................................................... 3.6
  p95: ......................................................................... 16.9
  p99: ......................................................................... 16.9


* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
--------------------------------------
Metrics for period to: 23:10:50(-0400) (width: 9.942s)
--------------------------------------

http.codes.200: ................................................................ 100
http.request_rate: ............................................................. 10/sec
http.requests: ................................................................. 100
http.response_time:
  min: ......................................................................... 0
  max: ......................................................................... 2
  median: ...................................................................... 1
  p95: ......................................................................... 1
  p99: ......................................................................... 1
http.responses: ................................................................ 100
plugins.expect.ok: ............................................................. 200
plugins.expect.ok.contentType: ................................................. 100
plugins.expect.ok.statusCode: .................................................. 100
vusers.completed: .............................................................. 100
vusers.created: ................................................................ 100
vusers.created_by_name.Filtrar productos por una propiedad: .................... 27
vusers.created_by_name.Obtener producto mediante sku: .......................... 30
vusers.created_by_name.Obtener productos: ...................................... 19
vusers.created_by_name.Obtener productos ordenados por una propiedad: .......... 24
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 2.4
  max: ......................................................................... 3.8
  median: ...................................................................... 2.9
  p95: ......................................................................... 3.4
  p99: ......................................................................... 3.6


* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos/15207410 
  ok statusCode 200
  ok contentType json
Phase completed: unnamed (index: 0, duration: 20s) 23:10:55(-0400)

* GET /api/productos/15207410
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
* GET /api/productos
  ok statusCode 200
  ok contentType json
* GET /api/productos 
  ok statusCode 200
  ok contentType json
--------------------------------------
Metrics for period to: 23:11:00(-0400) (width: 6.434s)
--------------------------------------

http.codes.200: ................................................................ 68
http.request_rate: ............................................................. 10/sec
http.requests: ................................................................. 68
http.response_time:
  min: ......................................................................... 0
  max: ......................................................................... 2
  median: ...................................................................... 1
  p95: ......................................................................... 1
  p99: ......................................................................... 2
http.responses: ................................................................ 68
plugins.expect.ok: ............................................................. 136
plugins.expect.ok.contentType: ................................................. 68
plugins.expect.ok.statusCode: .................................................. 68
vusers.completed: .............................................................. 68
vusers.created: ................................................................ 68
vusers.created_by_name.Filtrar productos por una propiedad: .................... 15
vusers.created_by_name.Obtener producto mediante sku: .......................... 18
vusers.created_by_name.Obtener productos: ...................................... 20
vusers.created_by_name.Obtener productos ordenados por una propiedad: .......... 15
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 2.2
  max: ......................................................................... 4.2
  median: ...................................................................... 2.5
  p95: ......................................................................... 3.3
  p99: ......................................................................... 3.5


All VUs finished. Total time: 21 seconds

--------------------------------
Summary report @ 23:10:58(-0400)
--------------------------------

http.codes.200: ................................................................ 200
http.request_rate: ............................................................. 10/sec
http.requests: ................................................................. 200
http.response_time:
  min: ......................................................................... 0
  max: ......................................................................... 2
  median: ...................................................................... 1
  p95: ......................................................................... 1
  p99: ......................................................................... 2
http.responses: ................................................................ 200
plugins.expect.ok: ............................................................. 400
plugins.expect.ok.contentType: ................................................. 200
plugins.expect.ok.statusCode: .................................................. 200
vusers.completed: .............................................................. 200
vusers.created: ................................................................ 200
vusers.created_by_name.Filtrar productos por una propiedad: .................... 50
vusers.created_by_name.Obtener producto mediante sku: .......................... 53
vusers.created_by_name.Obtener productos: ...................................... 46
vusers.created_by_name.Obtener productos ordenados por una propiedad: .......... 51
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 2.2
  max: ......................................................................... 17.4
  median: ...................................................................... 2.8
  p95: ......................................................................... 4.9
  p99: ......................................................................... 16.9
Log file: artillery-test.json
```

###### Reporte de los test de rendimiento

Para generar los reportes de los test de rendimiento debemos ejecutar el siguiente comando:

```shell
npm run test:performance-report
```
**NOTA:** Importante la generación del reporte depende del resultado de los test de rendimiento (**artillery-test.json**).

Finalmente nos generará un archivo **artillery-report.html**

![-----------------------------](/docs/img10.png)
**NOTA:** Como podemos ver tenemos una tabla con la cantidad de codigos 200, requests, responses y expect ok (serian los assert).

##### JMeter

_JMeter es una herramienta open source para analizar, medir el rendimiento y cargar el comportamiento funcional de la aplicación y la variedad de servicios._

_Cabe destacar que JMeter genera un reporte de los tests ejecutados._

###### Pre-requisitos 📋

_Que cosas necesitas para instalar el software y como instalarlas_

| Software      | Versión  |
|---------------|----------|
| Apache JMeter | 5.5      |

###### Instalar Apache JMeter

Para instalar JMeter debemos ir a la siguiente pagina: https://jmeter.apache.org/download_jmeter.cgi descargar apache-jmeter-5.5.tgz o apache-jmeter-5.5.zip dependiendo del caso, posteriormente dejar JMeter en un directiorio y crear las variables de entorno correspondiente:

###### Variables de entorno

- JMETER_HOME: Es la ruta principal de JMeter EJ.: C:/apache-jmeter-5.5
- PATH: es la ruta principal de JMeter mas la carpeta /bin EJ.: %JMETER_HOME%/bin

###### Configuración

Para configurar JMeter utilizaremos el siguiente archivo:

###### node-nestjs.jmx

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.2">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="node-nestjs" enabled="true">
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">true</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
      <boolProp name="TestPlan.tearDown_on_shutdown">false</boolProp>
    </TestPlan>
    <hashTree>
      <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Defaults" enabled="true">
        <collectionProp name="HeaderManager.headers">
          <elementProp name="" elementType="Header">
            <stringProp name="Header.name">Content-Type</stringProp>
            <stringProp name="Header.value">application/json</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
      <hashTree/>
      <ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults" enabled="true">
        <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
          <collectionProp name="Arguments.arguments"/>
        </elementProp>
        <stringProp name="HTTPSampler.domain">${__P(vHOST)}</stringProp>
        <stringProp name="HTTPSampler.port">${__P(vPORT)}</stringProp>
        <stringProp name="HTTPSampler.protocol">${__P(vPROTOCOL)}</stringProp>
        <stringProp name="HTTPSampler.response_timeout">${__P(vTIMEOUT)}</stringProp>
      </ConfigTestElement>
      <hashTree/>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Obtener Productos" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
          <stringProp name="LoopController.loops">1</stringProp>
          <boolProp name="LoopController.continue_forever">false</boolProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">${__P(vTHREADS)}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">${__P(vRAMP_UP)}</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
        <boolProp name="ThreadGroup.delayedStart">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Headers" enabled="true">
          <collectionProp name="HeaderManager.headers">
            <elementProp name="" elementType="Header">
              <stringProp name="Header.name">Authorization</stringProp>
              <stringProp name="Header.value">Bearer ${__property(token-login)}</stringProp>
            </elementProp>
          </collectionProp>
        </HeaderManager>
        <hashTree/>
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Obtener Productos" enabled="true">
          <boolProp name="HTTPSampler.postBodyRaw">false</boolProp>
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="Variables pr�-d�finies" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="HTTPSampler.path">${__P(vCONTEXT)}/${__P(vVERSION)}/productos</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
          <boolProp name="HTTPSampler.BROWSER_COMPATIBLE_MULTIPART">false</boolProp>
          <boolProp name="HTTPSampler.image_parser">false</boolProp>
          <boolProp name="HTTPSampler.concurrentDwn">false</boolProp>
          <stringProp name="HTTPSampler.concurrentPool">6</stringProp>
          <boolProp name="HTTPSampler.md5">false</boolProp>
          <intProp name="HTTPSampler.ipSourceType">0</intProp>
        </HTTPSamplerProxy>
        <hashTree/>
      </hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Obtener Productos Ordenados Por Precio Descediente" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
          <stringProp name="LoopController.loops">1</stringProp>
          <boolProp name="LoopController.continue_forever">false</boolProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">${__P(vTHREADS)}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">${__P(vRAMP_UP)}</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
        <boolProp name="ThreadGroup.delayedStart">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Headers" enabled="true">
          <collectionProp name="HeaderManager.headers">
            <elementProp name="" elementType="Header">
              <stringProp name="Header.name">Authorization</stringProp>
              <stringProp name="Header.value">Bearer ${__property(token-login)}</stringProp>
            </elementProp>
          </collectionProp>
        </HeaderManager>
        <hashTree/>
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Obtener Productos Ordenados Por Precio Descediente" enabled="true">
          <boolProp name="HTTPSampler.postBodyRaw">false</boolProp>
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="Variables pr�-d�finies" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="HTTPSampler.path">${__P(vCONTEXT)}/${__P(vVERSION)}/productos?sort=+precio</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
          <boolProp name="HTTPSampler.BROWSER_COMPATIBLE_MULTIPART">false</boolProp>
          <boolProp name="HTTPSampler.image_parser">false</boolProp>
          <boolProp name="HTTPSampler.concurrentDwn">false</boolProp>
          <stringProp name="HTTPSampler.concurrentPool">6</stringProp>
          <boolProp name="HTTPSampler.md5">false</boolProp>
          <intProp name="HTTPSampler.ipSourceType">0</intProp>
        </HTTPSamplerProxy>
        <hashTree/>
      </hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Obtener Productos Filtrados Por Precio" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
          <stringProp name="LoopController.loops">1</stringProp>
          <boolProp name="LoopController.continue_forever">false</boolProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">${__P(vTHREADS)}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">${__P(vRAMP_UP)}</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
        <boolProp name="ThreadGroup.delayedStart">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Headers" enabled="true">
          <collectionProp name="HeaderManager.headers">
            <elementProp name="" elementType="Header">
              <stringProp name="Header.name">Authorization</stringProp>
              <stringProp name="Header.value">Bearer ${__property(token-login)}</stringProp>
            </elementProp>
          </collectionProp>
        </HeaderManager>
        <hashTree/>
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Obtener Productos Filtrados Por Precio" enabled="true">
          <boolProp name="HTTPSampler.postBodyRaw">false</boolProp>
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="Variables pr�-d�finies" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="HTTPSampler.path">${__P(vCONTEXT)}/${__P(vVERSION)}/productos?precio=150000</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
          <boolProp name="HTTPSampler.BROWSER_COMPATIBLE_MULTIPART">false</boolProp>
          <boolProp name="HTTPSampler.image_parser">false</boolProp>
          <boolProp name="HTTPSampler.concurrentDwn">false</boolProp>
          <stringProp name="HTTPSampler.concurrentPool">6</stringProp>
          <boolProp name="HTTPSampler.md5">false</boolProp>
          <intProp name="HTTPSampler.ipSourceType">0</intProp>
        </HTTPSamplerProxy>
        <hashTree/>
      </hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Obtener Producto Por Sku" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
          <stringProp name="LoopController.loops">1</stringProp>
          <boolProp name="LoopController.continue_forever">false</boolProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">${__P(vTHREADS)}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">${__P(vRAMP_UP)}</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
        <boolProp name="ThreadGroup.delayedStart">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Headers" enabled="true">
          <collectionProp name="HeaderManager.headers">
            <elementProp name="" elementType="Header">
              <stringProp name="Header.name">Authorization</stringProp>
              <stringProp name="Header.value">Bearer ${__property(token-login)}</stringProp>
            </elementProp>
          </collectionProp>
        </HeaderManager>
        <hashTree/>
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Obtener Producto Por Sku" enabled="true">
          <boolProp name="HTTPSampler.postBodyRaw">false</boolProp>
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="Variables pr�-d�finies" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="HTTPSampler.path">${__P(vCONTEXT)}/${__P(vVERSION)}/productos/15207414</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
          <boolProp name="HTTPSampler.BROWSER_COMPATIBLE_MULTIPART">false</boolProp>
          <boolProp name="HTTPSampler.image_parser">false</boolProp>
          <boolProp name="HTTPSampler.concurrentDwn">false</boolProp>
          <stringProp name="HTTPSampler.concurrentPool">6</stringProp>
          <boolProp name="HTTPSampler.md5">false</boolProp>
          <intProp name="HTTPSampler.ipSourceType">0</intProp>
        </HTTPSamplerProxy>
        <hashTree/>
      </hashTree>
      <ResultCollector guiclass="ViewResultsFullVisualizer" testclass="ResultCollector" testname="View Results Tree" enabled="true">
        <boolProp name="ResultCollector.error_logging">false</boolProp>
        <objProp>
          <name>saveConfig</name>
          <value class="SampleSaveConfiguration">
            <time>true</time>
            <latency>true</latency>
            <timestamp>true</timestamp>
            <success>true</success>
            <label>true</label>
            <code>true</code>
            <message>true</message>
            <threadName>true</threadName>
            <dataType>true</dataType>
            <encoding>false</encoding>
            <assertions>true</assertions>
            <subresults>true</subresults>
            <responseData>false</responseData>
            <samplerData>false</samplerData>
            <xml>false</xml>
            <fieldNames>true</fieldNames>
            <responseHeaders>false</responseHeaders>
            <requestHeaders>false</requestHeaders>
            <responseDataOnError>false</responseDataOnError>
            <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
            <assertionsResultsToSave>0</assertionsResultsToSave>
            <bytes>true</bytes>
            <sentBytes>true</sentBytes>
            <url>true</url>
            <threadCounts>true</threadCounts>
            <idleTime>true</idleTime>
            <connectTime>true</connectTime>
          </value>
        </objProp>
        <stringProp name="filename"></stringProp>
      </ResultCollector>
      <hashTree/>
      <ResultCollector guiclass="SummaryReport" testclass="ResultCollector" testname="Summary Report" enabled="true">
        <boolProp name="ResultCollector.error_logging">false</boolProp>
        <objProp>
          <name>saveConfig</name>
          <value class="SampleSaveConfiguration">
            <time>true</time>
            <latency>true</latency>
            <timestamp>true</timestamp>
            <success>true</success>
            <label>true</label>
            <code>true</code>
            <message>true</message>
            <threadName>true</threadName>
            <dataType>true</dataType>
            <encoding>false</encoding>
            <assertions>true</assertions>
            <subresults>true</subresults>
            <responseData>false</responseData>
            <samplerData>false</samplerData>
            <xml>false</xml>
            <fieldNames>true</fieldNames>
            <responseHeaders>false</responseHeaders>
            <requestHeaders>false</requestHeaders>
            <responseDataOnError>false</responseDataOnError>
            <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
            <assertionsResultsToSave>0</assertionsResultsToSave>
            <bytes>true</bytes>
            <sentBytes>true</sentBytes>
            <url>true</url>
            <threadCounts>true</threadCounts>
            <idleTime>true</idleTime>
            <connectTime>true</connectTime>
          </value>
        </objProp>
        <stringProp name="filename"></stringProp>
      </ResultCollector>
      <hashTree/>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```
**NOTA:** Cabe destacar que de buena a primeras no entenderemos el xml de configuracion de JMeter

###### Definir Plan de Pruebas

Para poder modificar el plan de pruebas de JMeter debemos ejecutar el siguiente comando dentro de la raíz del proyecto:

```shell
jmeter -t performance-test/jmeter/node-nestjs.jmx -JvPROTOCOL=http -JvHOST="localhost" -JvPORT=3000 -JvCONTEXT=/api -JvVERSION=/ -JvAMBIENTE=dev -JvTHREADS=10 -JvTIMEOUT=8000 -JvRAMP_UP=1
```

![-----------------------------](/docs/img03.png)


JMeter se desplegará exitosamente mostrando el siguiente resultado en consola:

```shell
================================================================================
Don't use GUI mode for load testing !, only for Test creation and Test debugging.
For load testing, use CLI Mode (was NON GUI):
   jmeter -n -t [jmx file] -l [results file] -e -o [Path to web report folder]
& increase Java Heap to meet your test requirements:
   Modify current env variable HEAP="-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m" in the jmeter batch file
Check : https://jmeter.apache.org/usermanual/best-practices.html
================================================================================
```

Posteriormente se abrirá el GUI de JMeter:

![-----------------------------](/docs/img04.png)

**NOTA:** Como podemos ver se cargará el plan de pruebas con sus respectivos test

_Mediante el GUI de JMETER podemos ir creando/modificando los test_

###### Ejecución

**Pre-condición**

_La aplicación debe estar corriendo._

###### GUI

Para ejecutar los test de rendimiento debemos utilizar el botón ▶️ marcado con un borde rojo:

![-----------------------------](/docs/img05.png)

**NOTA:** Se empezarán a ejecutar los tests

![-----------------------------](/docs/img06.png)

**NOTA:** Como podemos ver el botón ▶️ se deshabilito y se habilito el botón 🛑 para parar la ejecución de los tests.

**Resultado**

Para ver el resultado de los test debemos entrar en la sección **View Results Tree** marcado con un borde rojo:

![-----------------------------](/docs/img07.png)

**NOTA:** Como podemos ver se ejecutaron los test de manera correcta (color verde).

###### Consola

Para ejecutar los test de rendimiento por consola debemos ejecutar el siguiente comando:

```shell
jmeter -n -t jmeter/node-nestjs.jmx -JvPROTOCOL=http -JvHOST="localhost" -JvPORT=3000 -JvCONTEXT=/api -JvVERSION=/ -JvAMBIENTE=dev -JvTHREADS=10 -JvTIMEOUT=8000 -JvRAMP_UP=1 -LDEBUG -l test_results.jtl -e -o jmeter-result
```

Los tests se ejecutarán exitosamente mostrando el siguiente resultado en consola:

```shell
Creating summariser <summary>
Created the tree successfully using jmeter/node-express.jmx
Starting standalone test @ 2022 Jul 17 15:23:42 CLT (1658085822467)
Waiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445
summary =     51 in 00:00:05 =   10.6/s Avg:     5 Min:     2 Max:    46 Err:     0 (0.00%)
Tidying up ...    @ 2022 Jul 17 15:23:47 CLT (1658085827440)
... end of run
```

![-----------------------------](/docs/img08.png)

**NOTA:** Como resultado de los test se generará un reporte de JMeter en el directorio /jmeter-result en un archivo index.html.

###### Reporte de los test de rendimiento

![-----------------------------](/docs/img09.png)
**NOTA:** Como podemos ver tenemos un grafico de los test ejecutados, tambien la tolerancia de cada test.

## Despliegue 📦

_Agrega notas adicionales sobre como hacer deploy_

Para desplegar la aplicación tenemos las siguientes formas:

Por defecto:

```shell
npm start
```
**NOTA:** Si se realiza un cambio a la aplicación no se reiniciará automáticamente.

Con Nest Watch:

```shell
npm run start:dev
```
**NOTA:** La aplicación se correra mediante nest watch (cualquier cambio realizado en un archivo js,json hará que la aplicación se refresque automáticamente).

La aplicación se desplegará exitosamente mostrando el siguiente resultado en consola:

```shell
  _   _           _        _   _           _      _ ____
 | \ | | ___   __| | ___  | \ | | ___  ___| |_   | / ___|
 |  \| |/ _ \ / _` |/ _ \ |  \| |/ _ \/ __| __|  | \___ \
 | |\  | (_) | (_| |  __/ | |\  |  __/\__ \ || |_| |___) |
 |_| \_|\___/ \__,_|\___| |_| \_|\___||___/\__\___/|____/
------------------------------------------------------------
MS: Node NestJS
MS VERSION: 1.0.0
NODE VERSION: v22.9.0
NESTJS: 9.3.9
CONTEXT PATH: /api
PORT: 3000
------------------------------------------------------------
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [NestFactory] Starting Nest application...
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] AppModule dependencies initialized +13ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] HttpModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] InfoModule dependencies initialized +1ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] TerminusModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] ConfigModule dependencies initialized +1ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] HealthModule dependencies initialized +1ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] JwtModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] ProductoModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [InstanceLoader] AuthModule dependencies initialized +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RoutesResolver] InfoController {/api/info}: +16ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RouterExplorer] Mapped {/api/info, GET} route +1ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RoutesResolver] HealthController {/api/health}: +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RouterExplorer] Mapped {/api/health, GET} route +1ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RoutesResolver] AuthController {/api/auth}: +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RouterExplorer] Mapped {/api/auth, POST} route +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RoutesResolver] ProductoController {/api/productos}: +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RouterExplorer] Mapped {/api/productos, GET} route +1ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RouterExplorer] Mapped {/api/productos/:sku, GET} route +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [RouterExplorer] Mapped {/api/productos, POST} route +0ms
[Nest] 19424  - 04-08-2025, 4:54:06 p. m.     LOG [NestApplication] Nest application successfully started +2ms
Server is listening on http://localhost:3000/api
```

## Swagger
### Documentar Endpoints
Para documentar los endpoints debemos hacerlo de forma manual mediante anotaciones especiales

#### General
La documentacion general se realiza creando una estructura especial llamada **DocumentBuilder** a continuacion el detalle

```javascript
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
```

Como podemos ver definimos la informacion del proyecto, contacto, licencia, version y los servidores

#### Rutas
Para documentar los endpoints debemos colocar una anotacion especial en la ruta

Ejemplo
InfoController

```javascript
@ApiTags('info')
@Controller('info')
export class InfoController {
    private infoConfig = configuration['info'];

    @ApiOkResponse({
        type: InformationDTO
    })
    @Get()
    info(): InformationDTO {
        return new InformationDTO(this.infoConfig.application.name, this.infoConfig.application.description, this.infoConfig.application.version);;
    }
}
```

Como podemos ver indicamos el tag con la anotación **@ApiTags**, el esquema de respuesta con **@ApiOkResponse**

#### DTO
Para documentar los dto debemos colocar una anotacion especial en el dto

Ejemplo
InformationDTO

```javascript
export class InformationDTO {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    version: string;

    constructor(name: string, description: string, version: string) {
        this.name = name;
        this.description = description;
        this.version = version;
    }
}
```

Tenemos que usar la anotación **@ApiProperty** para indicar que el campo es una propiedad y asi se genere el esquema automaticamente

### Configurar Swagger UI
Para configurar Swagger UI simplemente agregamos el siguiente codigo al archivo **main.ts**

```javascript
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
```

Como podemos ver definimos el **swaggerDocument** con la app y swagger config, posteriormente utilizamos **SwaggerModule** para inicializar el swagger ui

Cuando ejecutemos a la aplicacion debemos entrar a la pagina **/swagger-ui.html**

## Construido con 🛠️

_Menciona las herramientas que utilizaste para crear tu proyecto_

### Dependecias 🗃️

| Paquete       | Versión | Página NPM                            | Página Documentación           |
|---------------|---------|---------------------------------------|--------------------------------|
| axios         | 1.3.4   | https://www.npmjs.com/package/axios   | https://github.com/axios/axios |
| js-yaml       | 4.1.0   | https://www.npmjs.com/package/js-yaml |                                |
| morgan        | 1.10.0  | https://www.npmjs.com/package/morgan  |                                |

### Depedencias de desarrollo 🗃️

| Paquete                 | Versión   | Página NPM                                            | Página Documentación                                                        |
|-------------------------|-----------|-------------------------------------------------------|-----------------------------------------------------------------------------|
| @cucumber/cucumber      | 8.4.0     | https://www.npmjs.com/package/@cucumber/cucumber      | https://github.com/cucumber/cucumber-js                                     |
| artillery               | 2.0.0-30  | https://www.npmjs.com/package/artillery               | https://www.artillery.io/docs                                               |
| artillery-plugin-expect | 2.0.1     | https://www.npmjs.com/package/artillery-plugin-expect | https://www.artillery.io/docs/guides/plugins/plugin-expectations-assertions |

## Contribuyendo 🤝

Por favor lee el [CONTRIBUTING](CONTRIBUTING.md) para detalles de nuestro código de conducta, y el proceso para enviarnos pull requests.

## Wiki 📖

Puedes encontrar mucho más de cómo utilizar este proyecto en nuestra [Wiki](https://github.com/byron-villegas/node-nestjs/wiki)

## Medallas 🥇

Usamos [Shields](https://shields.io/) para la generación de las medallas.

## Versionado 📌

Usamos [SemVer](https://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/byron-villegas/node-nestjs/tags).

## Autores ✒️

_Menciona a todos aquellos que ayudaron a levantar el proyecto desde sus inicios_

- **Byron Villegas Moya** - *Desarrollador* - [byron-villegas](https://github.com/byron-villegas)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/byron-villegas/node-nestjs/graphs/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

Este proyecto está bajo la Licencia (MIT) - mira el archivo [LICENSE](LICENSE) para detalles
