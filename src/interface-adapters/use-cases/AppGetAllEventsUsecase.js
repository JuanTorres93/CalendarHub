import { GetAllEventsUsecase } from '../../application-layer/use-cases/event/GetAllEvents.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppGetAllEventsUsecase = new GetAllEventsUsecase(AppEventsRepo);