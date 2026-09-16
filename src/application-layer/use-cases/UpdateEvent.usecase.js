import { NotFoundDomainError } from '../../domain/common/domainErrors.js';

export class UpdateEventUsecase {
  constructor(eventsRepo) {
    this.eventsRepo = eventsRepo;
  }

  execute({ id, eventRawProps }) {
    const event = this.eventsRepo.getById(id);

    if (!event) {
      throw new NotFoundDomainError(`Event with id ${id} not found`);
    }

    event.update(eventRawProps);

    this.eventsRepo.save(event);

    return event;
  }
}