import { Injectable } from '@nestjs/common';
import * as usuarios from '../../data/usuarios.json';
import { Usuario } from './interfaces/usuario';

@Injectable()
export class AuthRepository {
    getUsers(): Usuario[] {
        return usuarios;
    }
}