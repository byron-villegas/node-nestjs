import { Injectable } from '@nestjs/common';
import * as productos from '../../data/productos.json';
import { Producto } from './interfaces/producto';
import * as fs from 'fs';

@Injectable()
export class ProductoRepository {
    getProductos(): Producto[] {
        return productos;
    }

    save(producto: Producto): void {
        let productos: Producto[] = this.getProductos();

        productos.push(producto);

        fs.writeFileSync('src/data/productos.json', JSON.stringify(productos, null, 2), 'utf8');
    }
}