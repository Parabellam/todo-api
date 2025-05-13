import { Module, Global } from '@nestjs/common';
import { ResponseMessageService } from './services/response-message.service';

@Global()
@Module({
  providers: [ResponseMessageService],
  exports: [ResponseMessageService],
})
export class CommonModule {}
