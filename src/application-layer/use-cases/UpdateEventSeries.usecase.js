import { NotFoundDomainError } from '../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../domain/common/domainErrorCodes.js';

export class UpdateEventSeriesUsecase {
  constructor(eventsRepo) {
    this.eventsRepo = eventsRepo;
  }

  execute({ id, originalRepeat, originalDate, eventRawProps }) {
    const event = this.eventsRepo.getById(id);

    if (!event) {
      throw new NotFoundDomainError(`Event with id ${id} not found`, {
        code: DomainErrorCodes.NOT_FOUND.EVENT,
        params: { id },
      });
    }

    const repeat = eventRawProps.repeat ?? event.repeat;

    const patternChanged =
      originalDate !== (eventRawProps.date ?? event.date) ||
      repeatPattern(originalRepeat) !== repeatPattern(repeat);

    event.update({
      ...eventRawProps,
      repeat: {
        ...repeat,
        exceptions: patternChanged ? [] : originalRepeat.exceptions,
      },
    });

    this.eventsRepo.save(event);

    return event;
  }
}

function repeatPattern(repeat) {
  return JSON.stringify({
    type: repeat.type,
    interval: repeat.interval,
    weekdays: repeat.weekdays,
    customDates: repeat.customDates,
  });
}