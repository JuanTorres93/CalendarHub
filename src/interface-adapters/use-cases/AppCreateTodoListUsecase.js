import { CreateTodoListUsecase } from '../../application-layer/use-cases/todolist/CreateTodoList.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';
import { AppIdGenerator } from '../services/AppIdGenerator.js';

export const AppCreateTodoListUsecase = new CreateTodoListUsecase(
  AppTodoListsRepo,
  AppIdGenerator,
);