import { ToggleTodoCompletionUsecase } from '../../application-layer/use-cases/todolist/ToggleTodoCompletion.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';

export const AppToggleTodoCompletionUsecase = new ToggleTodoCompletionUsecase(
  AppTodoListsRepo,
);