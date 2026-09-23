import { AppGetAllEventsUsecase } from '../../interface-adapters/use-cases/AppGetAllEventsUsecase.js';
import { getRepeatedEvents } from '../../eventCreation/generateRepeatEvents.js';

export function getAllRenderableEvents() {
  const eventsUpdated = AppGetAllEventsUsecase.execute();
  const eventOccurrencies = getRepeatedEvents();

  return [...eventsUpdated, ...eventOccurrencies];
}