import { Event } from '../../domain/entities/event/Event.js';
import { NotFoundDomainError } from '../../domain/common/domainErrors.js';

export class UpdateSingleEventOccurrenceUsecase {
  constructor(eventsRepo, idGenerator) {
    this.eventsRepo = eventsRepo;
    this.idGenerator = idGenerator;
  }

  execute({ motherEventId, occurrenceDate, eventRawProps }) {
    const motherEvent = this.eventsRepo.getById(motherEventId);

    if (!motherEvent) {
      throw new NotFoundDomainError(`Event with id ${motherEventId} not found`);
    }

    motherEvent.update({
      repeat: {
        ...motherEvent.repeat,
        exceptions: [...motherEvent.repeat.exceptions, occurrenceDate],
      },
    });

    this.eventsRepo.save(motherEvent);

    const newEvent = Event.create({
      ...eventRawProps,
      date: eventRawProps.date ?? occurrenceDate,
      repeat: null,
      id: this.idGenerator.generateId(),
    });

    this.eventsRepo.save(newEvent);

    return newEvent;
  }
}