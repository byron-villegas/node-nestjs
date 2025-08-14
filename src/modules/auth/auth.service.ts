import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDTO } from './dto/auth-request.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository, private jwtService: JwtService) { 

    }

    async signIn(authRequestDTO: AuthRequestDTO): Promise<AuthResponseDTO> {
        if(!authRequestDTO.username || !authRequestDTO.password) {
            throw new UnauthorizedException();
        }

        let usuarios = this.authRepository.getUsers();

        const user = usuarios.find(usuario => usuario.username === authRequestDTO.username && usuario.password === authRequestDTO.password);
    
        if(!user) {
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, nombres: user.nombres, apellidos: user.apellidos, authorities: '', scope: '' };

        const authResponseDTO = new AuthResponseDTO(user.id, user.nombres, user.apellidos, await this.jwtService.signAsync(payload));

        return authResponseDTO;
    }
}