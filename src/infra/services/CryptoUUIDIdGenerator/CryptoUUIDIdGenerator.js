import { IdGenerator } from '../../../application-layer/services/IdGenerator.port.js';

export class CryptoUUIDIdGenerator extends IdGenerator {
  generateId() {
    return crypto.randomUUID();
  }
}
