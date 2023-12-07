import { Module } from '@nestjs/common';
import { ExtendedLogger } from './extended-logger.service';

@Module({
  providers: [ExtendedLogger],
  exports: [ExtendedLogger],
})
export class LoggerModule {}
