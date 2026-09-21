import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';

export class UpdateEventUsecase {
  constructor(eventsRepo) {
    this.eventsRepo = eventsRepo;
  }

  execute({ id, eventRawProps }) {
    const event = this.eventsRepo.getById(id);

    if (!event) {
      throw new NotFoundDomainError(`Event with id ${id} not found`, {
        code: DomainErrorCodes.NOT_FOUND.EVENT,
        params: { id },
      });
    }

    event.update(eventRawProps);

    this.eventsRepo.save(event);

    return event;
  }
}