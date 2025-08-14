import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ErrorNegocioException } from '../exceptions/error-negocio.exception';
import { ErrorTecnicoException } from '../exceptions/error-tecnico.exception';

const mockAppLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
}));

const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
};

describe('HttpExceptionFilter', () => {
    let service: HttpExceptionFilter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HttpExceptionFilter,
                {
                    provide: Logger,
                    useValue: mockAppLoggerService,
                },
            ],
        }).compile();
        service = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    });

    describe('All exception filter tests', () => {
        it('Http exception', () => {
            service.catch(new HttpException({ message: 'Sample Exception' }, HttpStatus.BAD_REQUEST), mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
            expect(mockJson).toBeCalledTimes(1);
        });
        it('ErrorNegocio exception', () => {
            service.catch(new ErrorNegocioException('ABC', '123'), mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(HttpStatus.CONFLICT);
            expect(mockJson).toBeCalledTimes(1);
        });
        it('ErrorTecnico exception', () => {
            service.catch(new ErrorTecnicoException('CBA', '321'), mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockJson).toBeCalledTimes(1);
        });
    });
});