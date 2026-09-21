import { GetEventByIdUsecase } from '../../application-layer/use-cases/event/GetEventById.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppGetEventByIdUsecase = new GetEventByIdUsecase(AppEventsRepo);