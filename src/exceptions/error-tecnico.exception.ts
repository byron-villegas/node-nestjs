import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorTecnicoException  extends HttpException {
    codigo: string;
    mensaje: string;

    constructor(codigo: string, mensaje: string) {
        super({ codigo: codigo, mensaje: mensaje }, HttpStatus.INTERNAL_SERVER_ERROR);
        this.codigo = codigo;
        this.mensaje = mensaje;
    }
};