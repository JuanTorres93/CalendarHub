import { headerTitle, itemInput } from "../utils/helpers/dom/toDoDom.js";
export const toDoDraft = {
  id: "",
  date: "",
  title: "",
  items: [],
};

export const toDoItems = {
  id: "",
  title: "",
  completed: false,
};

export const initTodoDraft = (date) => {
  ((toDoDraft.id = ""),
    (toDoDraft.date = date),
    (toDoDraft.title = ""),
    (toDoDraft.items = []));
};

export const createNewTodo = (date, title) => {
  ((toDoDraft.id = crypto.randomUUID()),
    (toDoDraft.date = date),
    (toDoDraft.title = title),
    (toDoDraft.items = []));
};

export function resetStates(type) {
  headerTitle.value = "";
  toDoDraft.id = "";
  toDoDraft.items = [];
  toDoDraft.title = "";

  if (type === "close") {
    toDoDraft.date = "";
    return;
  }
}

export const resetToDoItemsValues = () => {
  toDoItems.id = "";
  toDoItems.title = "";
  toDoItems.completed = false;
  itemInput.value = "";
};
