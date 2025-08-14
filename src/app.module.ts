import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { InfoModule } from './modules/info/info.module';
import { ProductoModule } from './modules/producto/producto.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { DigimonModule } from './modules/digimon/digimon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }), InfoModule, HealthModule, AuthModule, ProductoModule, DigimonModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }