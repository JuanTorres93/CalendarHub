import { CreateEventUsecase } from '../../application-layer/use-cases/CreateEvent.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';
import { AppIdGenerator } from '../services/AppIdGenerator.js';

export const AppCreateEventUsecase = new CreateEventUsecase(
  AppEventsRepo,
  AppIdGenerator,
);