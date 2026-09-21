import { RenameTodoUsecase } from '../../application-layer/use-cases/todolist/RenameTodo.usecase.js';
import { AppTodoListsRepo } from '../repos/AppTodoListsRepo.js';

export const AppRenameTodoUsecase = new RenameTodoUsecase(AppTodoListsRepo);