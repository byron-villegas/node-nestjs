import { ProductoService } from './producto.service';
import * as productos from '../../data/productos.json'

describe('ProductoService', () => {
  let productoService: ProductoService;

  beforeEach(() => {
    const mockProductoRepository = {
      getProductos: jest.fn(() => productos),
      save: jest.fn(),
    } as any;
    productoService = new ProductoService(mockProductoRepository);
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const productosDTO = productos.map(producto => productoService.convert(producto));
      expect(await productoService.findAll()).toStrictEqual(productosDTO);
    });
  });

  describe('findBySku', () => {
    it('should return an product', async () => {
      const skuValue = '15207416';
      const productoEncontrado = productoService.convert(productos.find(producto => producto.sku == parseInt(skuValue)));
      expect(await productoService.findBySku(skuValue)).toStrictEqual(productoEncontrado);
    });
    it('should return an error for product not exists', async () => {
      try {
        const skuValue = '1';
        await productoService.findBySku(skuValue);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Producto no encontrado');
      }
    });

    it('should return an error for sku invalid', async () => {
      try {
        const skuValue = 'a';
        await productoService.findBySku(skuValue);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Codigo sku debe ser un numero entero');
      }
    });
  });

  describe('sortByProperty', () => {
    it('should return an array of products sort by property', async () => {
      const property = 'id';
      const productosOrdenados = productoService.sortByProperty(property);
      expect(await productoService.sortByProperty(property)).toStrictEqual(productosOrdenados);
    });
    it('should return an array of products sort by property with equal value', async () => {
      const property = '+precio';
      const productosOrdenados = productoService.sortByProperty(property);
      expect(await productoService.sortByProperty(property)).toStrictEqual(productosOrdenados);
    });
    it('should return an array of products sort by property asc', async () => {
      const property = '+id';
      const productosOrdenados = productoService.sortByProperty(property);
      expect(await productoService.sortByProperty(property)).toStrictEqual(productosOrdenados);
    });
    it('should return an array of products sort by property desc', async () => {
      const property = '-id';
      const productosOrdenados = productoService.sortByProperty(property);
      expect(await productoService.sortByProperty(property)).toStrictEqual(productosOrdenados);
    });
    it('should return an error', async () => {
      try {
        const property = '+t';
        await productoService.sortByProperty(property);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Propiedad no encontrada');
      }
    });
  });

  describe('findByPropertyAndValue', () => {
    it('should return an array of products filter by property', async () => {
      const property = 'nombre';
      const value = 'Nintendo';
      const productosFiltrados = productoService.findByPropertyAndValue(property, value);
      expect(await productoService.findByPropertyAndValue(property, value)).toStrictEqual(productosFiltrados);
    });
    it('should return an error property not found', async () => {
      try {
        const property = 't';
        const value = '';
        await productoService.findByPropertyAndValue(property, value);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Propiedad no encontrada');
      }
    });
    it('should return an error type of value not valid for property', async () => {
      try {
        const property = 'id';
        const value = 'ass';
        await productoService.findByPropertyAndValue(property, value);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Dato invalido');
      }
    });
  });

  describe('save', () => {

    it('should save an product', async () => {
      let productoAGuardar = productos.map(producto => productoService.convert(producto))[0];
      productoAGuardar.id = 3432442;
      productoAGuardar.sku = 11111111;

      await productoService.save(productoAGuardar);
    });

    it('should save an product with product exists by id', async () => {
      try {
        let productoAGuardar = productos.map(producto => productoService.convert(producto))[0];
        productoAGuardar.sku = 11111111;

        await productoService.save(productoAGuardar);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Producto ya existe');
      }
    });

    it('should save an product with product exists by sku', async () => {
      try {
        let productoAGuardar = productos.map(producto => productoService.convert(producto))[0];
        productoAGuardar.id = 343242532;

        await productoService.save(productoAGuardar);
      }
      catch (e) {
        expect(e.getResponse().mensaje).toBe('Producto ya existe');
      }
    });
  });
});