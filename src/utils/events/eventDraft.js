import { AppIdGenerator } from '../../interface-adapters/services/AppIdGenerator.js';

import { Event } from '../../domain/entities/event/Event.js';

export const globalEventState = {
  mode: 'create',
};

export const eventDraft = Event.create({
  id: AppIdGenerator.generateId(),
  title: 'draft',
  from: '00:00',
  to: '01:00',
});


