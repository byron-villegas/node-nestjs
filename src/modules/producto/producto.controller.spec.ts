import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import * as productos from '../../data/productos.json'

describe('ProductoController', () => {
  let productoController: ProductoController;
  let productoService: ProductoService;

  beforeEach(() => {
    const mockProductoRepository = {
      getProductos: jest.fn(()=> productos),
      save: jest.fn(),
    } as any;

    productoService = new ProductoService(mockProductoRepository);
    productoController = new ProductoController(productoService);
  });

  describe('findAll', () => {
    it('should return an array of products sorted by property', async () => {
      const sortValue = '+id';
      let productosOrdenados = productoService.sortByProperty(sortValue);
      jest.spyOn(productoService, 'findAll').mockImplementation(() => productosOrdenados);

      expect(await productoController.findAll({sort: sortValue})).toStrictEqual(productosOrdenados);
    });
    it('should return an array of product by id property', async () => {
      const property = 'id';
      const id = '7';
      let productosEncontrado = productoService.findByPropertyAndValue(property, id);
      jest.spyOn(productoService, 'findAll').mockImplementation(() => productosEncontrado);

      expect(await productoController.findAll({id: id.toString()})).toStrictEqual(productosEncontrado);
    });
    it('should return an array of products', async () => {
      jest.spyOn(productoService, 'findAll').mockImplementation(() => productos);

      expect(await productoController.findAll({})).toBe(productos);
    });
  });

  describe('findBySku', () => {
    it('should return an product by sku', async () => {
      const skuValue = 15207416;
      let productoEncontrado = productoService.findBySku(skuValue.toString());
      jest.spyOn(productoService, 'findBySku').mockImplementation(() => productoEncontrado);

      expect(await productoController.findBySku({sku: skuValue.toString()})).toStrictEqual(productoEncontrado);
    });
  });

  describe('save', () => {
    it('should save an product', async () => {
      let productoAGuardar = productoService.convert(productoService.findAll()[0]);

      jest.spyOn(productoService, 'save').mockImplementation(() => { });

      expect(await productoController.save(productoAGuardar));
    });
  });
});