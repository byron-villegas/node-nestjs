import { Injectable } from '@nestjs/common';
import { ErrorNegocioException } from '../../exceptions/error-negocio.exception';
import { CaracteristicaDTO } from './dto/caracteristica.dto';
import { ProductoDTO } from './dto/producto.dto';
import { Producto } from './interfaces/producto';
import { ProductoRepository } from './producto.repository';

@Injectable()
export class ProductoService {

    constructor(private productoRepository: ProductoRepository) { }

    findAll(): ProductoDTO[] {
        let productos: Producto[] = this.productoRepository.getProductos();

        return productos.map(producto => this.convert(producto));
    }

    findBySku(sku: string): ProductoDTO {
        let productos: Producto[] = this.productoRepository.getProductos();

        if (!sku.match(/^\d+$/)) {
            throw new ErrorNegocioException('EXCSDSNE00', 'Codigo sku debe ser un numero entero');
        }

        const producto = productos.find(producto => producto.sku == parseInt(sku));

        if (!producto) {
            throw new ErrorNegocioException('EXPNE00', 'Producto no encontrado');
        }

        return this.convert(producto);
    }

    sortByProperty(property: string): ProductoDTO[] {
        let productos: Producto[] = this.productoRepository.getProductos();

        const propiedad = property.includes('-') || property.includes('+') ? property.substring(1).trim() : property.trim();

        if (!productos[0][propiedad]) {
            throw new ErrorNegocioException('EXPNE01', 'Propiedad no encontrada');
        }

        let sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
        }

        const productosOrdenados = productos.sort((x, y) => {
            let result = (x[propiedad] < y[propiedad]) ? -1 : (x[propiedad] > y[propiedad]) ? 1 : 0;
            return result * sortOrder;
        });

        return productosOrdenados.map(producto => this.convert(producto));
    }

    findByPropertyAndValue(property: string, value: string): ProductoDTO[] {
        let productos: Producto[] = this.productoRepository.getProductos();

        const producto = productos[0];

        if (!producto[property]) {
            throw new ErrorNegocioException('EXPNE01', 'Propiedad no encontrada');
        }

        if ((typeof producto[property]) === 'number' && isNaN(parseInt(value))) {
            throw new ErrorNegocioException('EXDI00', 'Dato invalido');
        }

        const productosFiltrados = productos.filter(producto => {
            if ((typeof producto[property]) === 'number' && !isNaN(parseInt(value))) {
                return producto[property] == parseInt(value);
            } else {
                return producto[property].toUpperCase().includes(value.toUpperCase());
            }
        });

        return productosFiltrados.map(producto => this.convert(producto));
    }

    save(producto: ProductoDTO): void {
        let productos: Producto[] = this.productoRepository.getProductos();

        const productoExiste = productos.find(prod => prod.id === producto.id || prod.sku === producto.sku);

        if(productoExiste) {
            throw new ErrorNegocioException('EXPYE00', 'Producto ya existe');
        }

        this.productoRepository.save(this.convertToProducto(producto));
    }

    convert(producto: Producto): ProductoDTO {
        const caracteristicasDTO = producto.caracteristicas.map(caracteristica => {
            return new CaracteristicaDTO(caracteristica.titulo, caracteristica.valor);
        });

        const productoDTO = new ProductoDTO(producto.id, producto.sku, producto.imagen, producto.nombre, producto.descripcion, caracteristicasDTO, producto.marca, producto.precio);

        return productoDTO;
    }

    convertToProducto(producto: ProductoDTO): Producto {
        const caracteristicasDTO = producto.caracteristicas.map(caracteristica => {
            return new CaracteristicaDTO(caracteristica.titulo, caracteristica.valor);
        });

        const productoNuevo: Producto = { id: producto.id, sku: producto.sku, imagen: producto.imagen, nombre: producto.nombre, descripcion: producto.descripcion, caracteristicas:  caracteristicasDTO, marca: producto.marca, precio: producto.precio };

        return productoNuevo;
    }
}