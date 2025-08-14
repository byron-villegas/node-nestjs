import { Injectable } from "@nestjs/common";
import { DigimonDto } from "./dto/digimon.dto";
import { DigimonClient } from "./digimon.client";

@Injectable()
export class DigimonService {

    constructor(private readonly digimonClient: DigimonClient) {
        
    }
    
    async getDigimons(): Promise<DigimonDto[]> {
        return await this.digimonClient.getDigimons();
    }
}