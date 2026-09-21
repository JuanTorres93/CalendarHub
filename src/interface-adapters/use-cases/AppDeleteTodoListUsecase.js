import { DeleteTodoListUsecase } from '../../application-layer/use-cases/todolist/DeleteTodoList.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';

export const AppDeleteTodoListUsecase = new DeleteTodoListUsecase(
  AppTodoListsRepo,
);