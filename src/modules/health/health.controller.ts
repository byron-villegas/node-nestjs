import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private http: HttpHealthIndicator, private readonly disk: DiskHealthIndicator, private memory: MemoryHealthIndicator) { }

  @HttpCode(200)
  @Get()
  @HealthCheck()
  check() {
    //const basePath = process.execPath.split('\\')[0] + '/';
    return this.health.check([
      //() => this.http.pingCheck('ping', 'https://node-nestjs.onrender.com/api/health'),
      //() => this.disk.checkStorage('storage', { thresholdPercent: 0.9, path: basePath }),
      () => this.memory.checkHeap('heap', 500 * 1024 * 1024), // 500MB
      () => this.memory.checkRSS('RSS', 500 * 1024 * 1024) // 500MB
    ]);
  }
}