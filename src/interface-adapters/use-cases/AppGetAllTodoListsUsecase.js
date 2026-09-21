import { GetAllTodoListsUsecase } from '../../application-layer/use-cases/todolist/GetAllTodoLists.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';

export const AppGetAllTodoListsUsecase = new GetAllTodoListsUsecase(
  AppTodoListsRepo,
);