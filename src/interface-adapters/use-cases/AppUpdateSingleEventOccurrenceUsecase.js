import { UpdateSingleEventOccurrenceUsecase } from '../../application-layer/use-cases/UpdateSingleEventOccurrence.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';
import { AppIdGenerator } from '../services/AppIdGenerator.js';

export const AppUpdateSingleEventOccurrenceUsecase =
  new UpdateSingleEventOccurrenceUsecase(AppEventsRepo, AppIdGenerator);