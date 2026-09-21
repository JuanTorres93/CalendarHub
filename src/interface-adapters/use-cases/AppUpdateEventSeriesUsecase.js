import { UpdateEventSeriesUsecase } from '../../application-layer/use-cases/event/UpdateEventSeries.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppUpdateEventSeriesUsecase = new UpdateEventSeriesUsecase(
  AppEventsRepo,
);