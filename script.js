// script.js
let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");

document.addEventListener("DOMContentLoaded", () => {
  addButton.addEventListener("click", handleAdd);
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAdd();
  });
  deleteButton.addEventListener("click", handleClearAll);
  render();
});

function handleAdd() {
  const text = todoInput.value.trim();
  if (!text) return; // do nothing if empty
  todo.push({ text, completed: false });
  todoInput.value = "";
  saveAndRender();
}

function createTodoElement(item, index) {
  const li = document.createElement("li");
  li.className = "todo-item";

  // left area (checkbox + text)
  const left = document.createElement("div");
  left.className = "left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = item.completed;
  checkbox.addEventListener("change", () => {
    todo[index].completed = checkbox.checked;
    saveAndRender();
  });

  // text element (editable)
  const span = document.createElement("span");
  span.className = "todo-text";
  if (item.completed) span.classList.add("completed");
  span.id = `todo-${index}`;
  span.textContent = item.text;

  // allow editing: click to replace with input
  span.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.text;
    input.className = "input-field";
    span.replaceWith(input);
    input.focus();

    function saveEdit() {
      const newText = input.value.trim();
      if (newText) {
        todo[index].text = newText;
      }
      saveAndRender();
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") {
        // cancel edit: re-render without change
        render();
      }
    });

    input.addEventListener("blur", saveEdit);
  });

  left.appendChild(checkbox);
  left.appendChild(span);

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-single";
  deleteBtn.textContent = "წაშლა";
  deleteBtn.addEventListener("click", () => {
    todo.splice(index, 1);
    saveAndRender();
  });

  li.appendChild(left);
  li.appendChild(deleteBtn);

  return li;
}

function render() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const el = createTodoElement(item, index);
    todoList.appendChild(el);
  });
  todoCount.textContent = todo.length;
}

function handleClearAll() {
  if (todo.length === 0) return;
  // optional: confirm before clearing
  const ok = confirm("ყველა დავალების წაშლა?"); // Georgian: Delete all tasks?
  if (!ok) return;
  todo = [];
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("todo", JSON.stringify(todo));
  render();
}
