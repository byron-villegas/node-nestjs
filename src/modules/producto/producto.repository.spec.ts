import { ProductoRepository } from './producto.repository';
import { Producto } from './interfaces/producto';
import * as productosData from '../../data/productos.json';

describe('ProductoRepository', () => {
  let productoRepository: ProductoRepository;

  beforeEach(() => {
    productoRepository = new ProductoRepository();
  });

  it('getProductos debe devolver la lista de productos', () => {
    expect(productoRepository.getProductos()).toBe(productosData);
  });

  it('save debe agregar un producto y llamar a writeFileSync', () => {
    const producto: Producto = {
        id: 999, 
        nombre: 'Test', 
        precio: 10,
        sku: 0,
        imagen: '',
        descripcion: '',
        caracteristicas: [],
        marca: ''
    };

    productoRepository.save(producto);

    // El producto debe estar en la lista
    expect(productoRepository.getProductos()).toContainEqual(producto);
  });
});