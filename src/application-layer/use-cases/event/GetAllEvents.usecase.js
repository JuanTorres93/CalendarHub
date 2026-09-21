export class GetAllEventsUsecase {
  constructor(eventsRepo) {
    this.eventsRepo = eventsRepo;
  }

  execute() {
    return this.eventsRepo.getAll();
  }
}