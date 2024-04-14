import { Injectable } from '@nestjs/common';
import { CursorGenerationArgs } from './interfaces/cursor.interface';

@Injectable()
export class CursorService {
  generateCursor = ({ entityId }: CursorGenerationArgs) => {
    return Buffer.from(entityId.toString(), 'utf-8').toString('base64');
  };

  decodeCursor = (cursor: string): CursorGenerationArgs => {
    return {
      entityId: Number.parseInt(Buffer.from(cursor, 'base64').toString('utf8')),
    };
  };
}
