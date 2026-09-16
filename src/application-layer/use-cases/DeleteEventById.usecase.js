export class DeleteEventByIdUsecase {
  constructor(eventsRepo) {
    this.eventsRepo = eventsRepo;
  }

  execute({ id }) {
    this.eventsRepo.deleteById(id);
  }
}