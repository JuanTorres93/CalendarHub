import { GetEventByIdUsecase } from '../../application-layer/use-cases/GetEventById.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppGetEventByIdUsecase = new GetEventByIdUsecase(AppEventsRepo);