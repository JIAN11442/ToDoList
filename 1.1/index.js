let input_wrapper = document.getElementsByClassName("input")[0];
let taskInput = document.getElementsByClassName("input-text")[0];
let all_span = document.querySelectorAll("span");
let span_all = document.getElementById("all");
let span_pending = document.getElementById("pending");
let span_completed = document.getElementById("completed");
let clearbtn = document.getElementsByClassName("clear-btn")[0];
let taskBox = document.querySelectorAll(".task-box")[0];
let taskMenu = document.querySelectorAll(".task-box .task .settings");

let editId,
  isEditTask = false;
todos = JSON.parse(localStorage.getItem("todo-list"));

// setting input box padding
let inputbox_width = input_wrapper.offsetWidth;
// console.log(inputbox_width);
// console.log(input_wrapper.getBoundingClientRect().width);
taskInput.style.padding = `0px 20px 0px ${inputbox_width * 0.15}px`;

// setting input status in different situlation
taskInput.addEventListener("focus", () => {
  taskInput.setAttribute("placeholder", "");
});
taskInput.addEventListener("blur", () => {
  taskInput.setAttribute("placeholder", "Add a new task");
});

// setting each span style and show the true todolist when click that span
all_span.forEach((span_element) => {
  span_element.addEventListener("click", () => {
    // 當點擊其中一個span時，先把所有span的下底線拿掉（就是remove掉active classname）
    all_span.forEach((eRemove) => {
      eRemove.classList.remove("active");
    });
    // 再賦予active classname
    span_element.classList.add("active");
    showTodo(span_element.id);
  });
});

// 當刷新就點擊span為all的選項，讓所有task list都出來
// 當然要用showTodo('all')也可以，但有個缺點就是All span不會有點擊切換的css style,包括下底線那些
window.onload = all_span[0].click();

// --------------------------------------------------------------------

function showTodo(spanId) {
  let liTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (spanId == todo.status || spanId == "all") {
        liTag += `<li class="task">
          <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}/>
            <p class="${completed}${id}">${todo.task}</p>
          </label>
          <div class="settings">
            <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
            <ul class="task-menu" style="display: none;" id="${id}">
              <li onclick="editTask(${id},'${todo.task}')">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Edit</span>
              </li>
              <li onclick="deleteTask(${id},'${spanId}')">
                <i class="fa-solid fa-trash-can"></i>
                <span>Delete</span>
              </li>
            </ul>
          </div>
        </li>`;
      }
    });
  }

  /* 運算邏輯概念：
     當'||'(OR)時，會優先選擇轉換為bool為'true'的運算元素，例如以下的實例，當liTag是空字串，會被當作false而返回為true第二運算元素
     當'&&'(AND)時，會看第一個運算元素是否為'true',如果是就會返回第二個運算元素；反之，如果第一個運算元素是'false'，就會直接返回第一個運算元素
     簡單來說，當'||' => 看哪個是'true',返回哪個；當'&&' => 看第一運算元素，是false就返回第一個，不是就返回第二個
     */
  taskBox.innerHTML =
    liTag || `<span class="no-task-span">You don't have any task here</span>`;

  /* 當todos沒有task時，設定taskBox中的span的 css style */
  clearbtn_NotaskSpan_active();
  // // 當點擊checkbox，會出現
  // completedStyle();
}

function clearbtn_NotaskSpan_active() {
  try {
    let no_task_span = taskBox.querySelector(".no-task-span");
    if (!no_task_span) {
      /* 當todos有task時，添加一個active classname給clearbtn，激活對應的css
         這裡也不一定要特別query taskBox下的task來判斷有沒有task，可以直接用 todos */
      let checkTask = taskBox.querySelectorAll(".task");
      !checkTask.length
        ? clearbtn.classList.remove("active")
        : clearbtn.classList.add("active");
      taskBox.style.display = "flex";
      taskBox.style.flexDirection = "column";
    } else {
      taskBox.style.flexDirection = "row";
      taskBox.style.justifyContent = "center";
      no_task_span.style.color = "rgba(0,0,0,0.4)";
      no_task_span.style.fontSize = "18px";
      no_task_span.style.filter = "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))";
    }
  } catch (e) {
    console.log(e);
  }
}

// function clearAllTask() {
//   /* 監聽當點擊button時，要刪除當前span選項的所有task */
//   clearbtn.addEventListener("click", () => {
//     let active_span = document.querySelector("span.active");
//     let remain_todos_index = [];
//     if (active_span.id == "all") {
//       todos = [];
//     } else {
//       todos.forEach((todo, id) => {
//         if (todo.status != active_span.id) {
//           remain_todos_index.push(todo);
//         }
//       });
//     }
//     todos = remain_todos_index;
//     console.log(todos);
//     showTodo(active_span.id);
//   });
// }

// function editTask(id, task) {
//   console.log(id, task);
// }

// function showMenu(element) {
//   let elmt_taskMenu = element.parentElement.querySelector(".task-menu");
//   document.querySelectorAll(".settings .task-menu").forEach((tskMenu, id) => {
//     if (elmt_taskMenu.id == id) {
//       elmt_taskMenu.style.display == "none"
//         ? (elmt_taskMenu.style.display = "block")
//         : (elmt_taskMenu.style.display = "none");
//     } else {
//       tskMenu.style.display = "none";
//     }
//   });
// }

// function TaskInput(event) {
//   let json_template = { task: "", status: "" };
//   try {
//     if (event.keyCode == 13 && event.target.value != "") {
//       json_template.task = event.target.value;
//       json_template.status = "pending";
//       todos.push(json_template);
//       event.target.value = "";
//       document.querySelector(".control .filter span.active").click();
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

// function updateStatus(element) {
//   todos.forEach((todo, id) => {
//     if (element.parentElement.querySelector("p").textContent == todo.task) {
//       let element_p = element.parentElement.querySelector("p");
//       if (element.checked) {
//         todos[id].status = "completed";
//         element_p.classList.remove(element_p.className);
//         element_p.classList.add(`checked${id}`);
//         completedStyle();
//       } else {
//         todos[id].status = "pending";
//         element_p.classList.remove(element_p.className);
//         element_p.classList.add(`${id}`);
//         completedStyle();
//       }
//       // console.log(todos[id]);
//     }
//   });
// }

// function completedStyle() {
//   let input_ps = document.querySelectorAll("label p");
//   input_ps.forEach((input_p, id) => {
//     if (input_p.className.slice(0, 7) == "checked") {
//       let p_length = input_p.textContent.length;
//       let fontSize = parseInt(window.getComputedStyle(input_p).fontSize);
//       let textWidth = input_p.getBoundingClientRect().width;
//       let remSize = textWidth / fontSize;
//       let remSize_model = remSize + remSize * 0.12;
//       // console.log(
//       //   input_p.textContent,
//       //   fontSize,
//       //   textWidth,
//       //   remSize,
//       //   remSize_model
//       // ),
//       document.styleSheets[1].insertRule(
//         `.task-box .task label .${input_p.className}::before {width:${remSize_model}rem}`,
//         0
//       );
//       input_p.style.color = "rgba(0,0,0,0.5)";
//     } else {
//       input_p.style.color = "rgb(0,0,0)";
//     }
//   });
// }
