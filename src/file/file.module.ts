import { Module } from '@nestjs/common';
import { FileService } from './domain/service/file.service';
import { FileRepository } from './infrastructure/repository/file.repository';

@Module({
  controllers: [],
  providers: [FileService, FileRepository],
  exports: [FileService, FileRepository],
})
export class FileModule {}
