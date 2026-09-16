import { DeleteEventByIdUsecase } from '../../application-layer/use-cases/DeleteEventById.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppDeleteEventByIdUsecase = new DeleteEventByIdUsecase(
  AppEventsRepo,
);