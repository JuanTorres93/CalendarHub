import { DeleteEventByIdUsecase } from '../../application-layer/use-cases/event/DeleteEventById.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppDeleteEventByIdUsecase = new DeleteEventByIdUsecase(
  AppEventsRepo,
);