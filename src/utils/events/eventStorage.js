import { AppEventsRepo } from '../../interface-adapters/repos/AppEventsRepo.js';
import { AppGetAllEventsUsecase } from '../../interface-adapters/use-cases/AppGetAllEventsUsecase.js';
import { Event } from '../../domain/entities/event/Event.js';
import { toDomainNotificationIfItalian } from '../../interface-adapters/other/bidirectionalItalianDomainMapper.js';

export function getEvents() {
  try {
    return AppGetAllEventsUsecase.execute().map((eventEntity) =>
      Event.create({
        ...eventEntity.toJSON(),
        notification: toDomainNotificationIfItalian(eventEntity.notification),
      }),
    );
  } catch (error) {
    console.error('Unable to read calendar events from localStorage:', error);
    return [];
  }
}

export function deleteEventFromLocalStorage(currentId) {
  AppEventsRepo.deleteById(currentId);
}