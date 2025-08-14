import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { configuration } from '../../config/configuration';
import { InformationDTO } from './dto/information.dto';

@ApiTags('info')
@Controller('info')
export class InfoController {
    private infoConfig = configuration['info'];

    @ApiOkResponse({
        type: InformationDTO
    })
    @Get()
    info(): InformationDTO {
        return new InformationDTO(this.infoConfig.application.name, this.infoConfig.application.description, this.infoConfig.application.version);
    }
}