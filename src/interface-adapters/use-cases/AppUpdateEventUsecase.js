import { UpdateEventUsecase } from '../../application-layer/use-cases/UpdateEvent.usecase.js';
import { AppEventsRepo } from '../repos/AppEventsRepo.js';

export const AppUpdateEventUsecase = new UpdateEventUsecase(AppEventsRepo);