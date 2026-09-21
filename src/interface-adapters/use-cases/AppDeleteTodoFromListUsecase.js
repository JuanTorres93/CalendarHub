import { DeleteTodoFromListUsecase } from '../../application-layer/use-cases/todolist/DeleteTodoFromList.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';

export const AppDeleteTodoFromListUsecase = new DeleteTodoFromListUsecase(
  AppTodoListsRepo,
);