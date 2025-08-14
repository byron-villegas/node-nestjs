import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorNegocioException extends HttpException {
    codigo: string;
    mensaje: string;

    constructor(codigo: string, mensaje: string) {
        super({ codigo: codigo, mensaje: mensaje }, HttpStatus.CONFLICT);
        this.codigo = codigo;
        this.mensaje = mensaje;
    }
};