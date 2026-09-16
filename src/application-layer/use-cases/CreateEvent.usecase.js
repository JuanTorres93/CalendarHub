import { Event } from '../../domain/entities/event/Event.js';

export class CreateEventUsecase {
  constructor(eventsRepo, idGenerator) {
    this.eventsRepo = eventsRepo;
    this.idGenerator = idGenerator;
  }

  execute(request) {
    const event = Event.create({
      ...request,
      id: this.idGenerator.generateId(),
    });

    this.eventsRepo.save(event);

    return event;
  }
}