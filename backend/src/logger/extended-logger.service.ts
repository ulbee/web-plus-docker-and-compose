import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class ExtendedLogger extends ConsoleLogger {
  customLog(message: string) {
    this.log(`!!!!!!!!!!!!!!!!!![Custom Message] ${message}`);
  }
}
