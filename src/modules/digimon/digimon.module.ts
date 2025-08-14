import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DigimonController } from './digimon.controller';
import { DigimonService } from './digimon.service';
import { DigimonClient } from './digimon.client';

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [DigimonController],
    providers: [DigimonClient, DigimonService],
})
export class DigimonModule { }
