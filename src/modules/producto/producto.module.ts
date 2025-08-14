import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProductoRepository } from './producto.repository';

@Module({
    imports: [ConfigModule],
    controllers: [ProductoController],
    providers: [ProductoService, JwtService, ProductoRepository],
})
export class ProductoModule { }