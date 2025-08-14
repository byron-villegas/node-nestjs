import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DigimonDto } from './dto/digimon.dto';
import { DigimonService } from './digimon.service';

@ApiTags('digimons')
@Controller('digimons')
export class DigimonController {

    constructor(private digimonService: DigimonService) {
        
    }

    @ApiOkResponse({
        type: DigimonDto
    })
    @HttpCode(200)
    @Get()
    async findAllDigimons(): Promise<DigimonDto[]> {
        const digimons = await this.digimonService.getDigimons();
        return digimons;
    }
}