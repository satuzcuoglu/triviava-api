import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class CryptoService {
  getMD5Hash(data: string) {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
