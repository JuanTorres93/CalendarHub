import { RenameTodoListUsecase } from '../../application-layer/use-cases/todolist/RenameTodoList.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';

export const AppRenameTodoListUsecase = new RenameTodoListUsecase(
  AppTodoListsRepo,
);