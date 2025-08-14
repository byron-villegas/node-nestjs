import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DigimonDto } from "./dto/digimon.dto";

@Injectable()
export class DigimonClient {
    constructor(private readonly httpService: HttpService) { }

    async getDigimons(): Promise<DigimonDto[]> {
        const response = await firstValueFrom(this.httpService.get('https://digimon-api.vercel.app/api/digimon'));
        return response.data as DigimonDto[];
    }
}