import { NotFoundDomainError } from '../../domain/common/domainErrors.js';

export class GetEventByIdUsecase {
  constructor(eventsRepo) {
    this.eventsRepo = eventsRepo;
  }

  execute({ id }) {
    const event = this.eventsRepo.getById(id);

    if (!event) {
      throw new NotFoundDomainError(`Event with id ${id} not found`);
    }

    return event;
  }
}