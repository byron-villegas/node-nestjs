import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductoDTO } from './dto/producto.dto';
import { ProductoService } from './producto.service';
import { AuthGuard } from '../.././guard/auth.guard';

@ApiTags('productos')
@Controller('productos')
export class ProductoController {

    constructor(private productoService: ProductoService) { }

    @ApiOkResponse({
        type: ProductoDTO,
        isArray: true
    })
    @HttpCode(200)
    @Get()
    findAll(@Query() query): ProductoDTO[] {
        const queryKeys = Object.keys(query);
        const property = queryKeys[0];

        switch (property) {
            case 'sort':
                return this.productoService.sortByProperty(query.sort);
            default:
                const value = query[property];

                if (property) {
                    return this.productoService.findByPropertyAndValue(property, value);
                }

                return this.productoService.findAll();
        }
    }

    @ApiOkResponse({
        type: ProductoDTO
    })
    @HttpCode(200)
    @Get(':sku')
    @ApiParam({ name: 'sku' })
    findBySku(@Param() params): ProductoDTO {
        return this.productoService.findBySku(params.sku);
    }

    @UseGuards(AuthGuard)
    @HttpCode(201)
    @Post()
    save(@Body() producto: ProductoDTO) {
        this.productoService.save(producto);
    }
}