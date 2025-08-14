import { ApiProperty } from "@nestjs/swagger";

export class DigimonDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    image: string;
    @ApiProperty()
    level: string;

    constructor(name: string = '', image: string = '', level: string = '') {
        this.name = name;
        this.image = image;
        this.level = level;
    }
}
