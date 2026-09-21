import { AddTodoToListUsecase } from '../../application-layer/use-cases/todolist/AddTodoToList.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';
import { AppIdGenerator } from '../services/AppIdGenerator.js';

export const AppAddTodoToListUsecase = new AddTodoToListUsecase(
  AppTodoListsRepo,
  AppIdGenerator,
);