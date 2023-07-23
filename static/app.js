Vue.component('todo-item', {
  props: ['todo'],
  template: `
    <li :class="{ 'line-through': todo.completed }" class="bg-gray-100 p-2 rounded-lg">
      <span>
        <i @click="toggleCompleted" :class="['fas', todo.completed ? 'fa-check-circle' : 'fa-circle', 'mr-2', 'cursor-pointer']"></i>
        <i @click="deleteTodo" class="fas fa-trash-alt"></i>
        {{ todo.text }}
      </span>
    </li>
  `,
  methods: {
    deleteTodo() {
      this.$emit('delete-todo');
    },
    toggleCompleted() {
      this.$emit('toggle-completed');
    },
  },
});

Vue.component('todo-list', {
  props: ['listName', 'todos'],
  data() {
    return {
      newTodo: '',
    };
  },
  methods: {
    addTodo() {
      const todoText = this.newTodo.trim();
      if (todoText) {
        this.todos.push({ text: todoText, completed: false });
        this.newTodo = '';
      }
    },
    deleteTodo(index) {
      this.todos.splice(index, 1);
    },
    toggleCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
    },
  },
  template: `
    <div class="bg-gray-100 p-2 rounded-lg">
      <h2 class="text-xl font-bold mb-2">{{ listName }}</h2>
      <div class="mb-4 flex items-center">
        <input type="text" v-model="newTodo" @keyup.enter="addTodo" placeholder="Enter new todo" class="flex-1 px-4 py-2 border rounded-lg">
        <button @click="addTodo" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <ul class="space-y-2">
        <todo-item
          v-for="(todo, index) in todos"
          :key="index"
          :todo="todo"
          @delete-todo="deleteTodo(index)"
          @toggle-completed="toggleCompleted(index)"
        ></todo-item>
      </ul>
    </div>
  `,
});

Vue.component('board', {
  props: ['boardData'],
  data() {
    return {
      newListName: '',
      editingBoardName: false,
      editingListIndex: -1,
    };
  },
  methods: {
    addList() {
      if (this.newListName) {
        this.boardData.lists.push({
          listName: this.newListName,
          todos: [],
        });
        this.newListName = '';
      }
    },
    deleteList(index) {
      this.boardData.lists.splice(index, 1);
    },
    startEditingBoardName() {
      this.editingBoardName = true;
    },
    saveBoardName() {
      this.editingBoardName = false;
    },
    startEditingListName(index) {
      this.editingListIndex = index;
    },
    saveListName() {
      this.editingListIndex = -1;
    },
  },
  template: `
    <div>
      <h1 class="text-3xl font-bold mb-4" v-if="!editingBoardName" @click="startEditingBoardName">{{ boardData.boardName }}</h1>
      <input v-if="editingBoardName" v-model="boardData.boardName" @keyup.enter="saveBoardName" @blur="saveBoardName" class="text-3xl font-bold mb-4 outline-none border-b border-blue-500">
      <div class="mb-4 flex">
        <input
          type="text"
          v-if="!editingListIndex"
          v-model="newListName"
          @keyup.enter="addList"
          placeholder="Enter new list name"
          class="px-4 py-2 border rounded-lg"
        >
        <button v-if="!editingListIndex" @click="addList" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
          Add List
        </button>
        <input
          v-if="editingListIndex === index"
          v-model="boardData.lists[index].listName"
          @keyup.enter="saveListName"
          @blur="saveListName"
          class="px-4 py-2 border rounded-lg"
        >
        <button v-if="editingListIndex === index" @click="saveListName" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
          Save
        </button>
      </div>
      
      <div class="flex space-x-4">
        <todo-list
          v-for="(list, index) in boardData.lists"
          :key="index"
          :listName="list.listName"
          :todos="list.todos"
          @delete-list="deleteList(index)"
          @start-editing="startEditingListName(index)"
        ></todo-list>
      </div>
      
    </div>
  `,
});

Vue.component('workspace', {
  data() {
    return {
      drawerOpen: false,
      newBoardName: '',
      boards: [
        {
          boardName: 'Board 1',
          lists: [
            {
              listName: 'List 1',
              todos: [
                { text: 'Todo 1 for List 1 in Board 1', completed: false },
                { text: 'Todo 2 for List 1 in Board 1', completed: true },
                { text: 'Todo 3 for List 1 in Board 1', completed: false },
              ],
            },
            {
              listName: 'List 2',
              todos: [
                { text: 'Todo 1 for List 2 in Board 1', completed: true },
                { text: 'Todo 2 for List 2 in Board 1', completed: false },
                { text: 'Todo 3 for List 2 in Board 1', completed: true },
              ],
            },
          ],
        },
        {
          boardName: 'Board 2',
          lists: [
            {
              listName: 'List 1',
              todos: [
                { text: 'Todo 1 for List 1 in Board 2', completed: false },
                { text: 'Todo 2 for List 1 in Board 2', completed: true },
                { text: 'Todo 3 for List 1 in Board 2', completed: false },
              ],
            },
            {
              listName: 'List 2',
              todos: [
                { text: 'Todo 1 for List 2 in Board 2', completed: true },
                { text: 'Todo 2 for List 2 in Board 2', completed: false },
                { text: 'Todo 3 for List 2 in Board 2', completed: true },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    switchBoard(boardIndex) {
      this.drawerOpen = false;
      this.$emit('switch-board', boardIndex);
    },
    addBoard() {
      if (this.newBoardName) {
        this.boards.push({
          boardName: this.newBoardName,
          lists: [],
        });
        this.newBoardName = '';
      }
    },
    saveBoards() {
      localStorage.setItem('boards', JSON.stringify(this.boards));
      alert('Boards saved successfully!');
    },
    exportBoards() {
      const data = JSON.stringify(this.boards);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'boards.json';
      a.click();
      URL.revokeObjectURL(url);
    },
  },
  template: `
    <div class="flex">
      <div v-if="drawerOpen" class="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg">
        <div class="p-4 border-b">
          <button @click="toggleDrawer" class="text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">Boards</h2>
          <ul>
            <li v-for="(board, index) in boards" :key="index" @click="switchBoard(index)" class="cursor-pointer text-blue-500 hover:underline">
              {{ board.boardName }}
            </li>
          </ul>
        </div>
        <div class="p-4">
          <input
            type="text"
            v-model="newBoardName"
            @keyup.enter="addBoard"
            placeholder="Enter new board name"
            class="px-4 py-2 border rounded-lg"
          >
          <button @click="addBoard" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
            Add Board
          </button>
        </div>
        <div class="p-4">
          <button @click="saveBoards" class="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Save
          </button>
          <button @click="exportBoards" class="px-4 py-2 ml-2 bg-green-500 text-white rounded-lg">
            Export
          </button>
        </div>
      </div>
      <div class="flex-1">
        <div class="p-4">
          <button @click="toggleDrawer" class="text-gray-600">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        <div class="container mx-auto px-4 py-8">
          <board :boardData="boards[0]" @delete-list="deleteList(index)"></board>
        </div>
      </div>
    </div>
  `,
});

new Vue({
  el: '#app',
  template: `
    <div>
      <workspace></workspace>
    </div>
  `,
});

