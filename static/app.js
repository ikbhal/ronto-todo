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
  props: ['list'],
  data() {
    return {
      newListName: '',
      editMode: false,
      newTodo: '',
    };
  },
  methods: {
    addTodo() {
      const todoText = this.newTodo.trim();
      if (todoText) {
        this.list.todos.push({ text: todoText, completed: false });
        this.newTodo = '';
      }
    },
    deleteTodo(index) {
      this.list.todos.splice(index, 1);
    },
    toggleCompleted(index) {
      this.list.todos[index].completed = !this.list.todos[index].completed;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveListName() {
      if (this.newListName) {
        this.list.listName = this.newListName;
        this.editMode = false;
      }
    },
    onEnterSaveListName(event) {
      if (event.key === 'Enter') {
        this.saveListName();
      }
    },
    deleteList() {
      this.$emit('delete-list');
    },
  },
  template: `
    <div class="bg-gray-100 p-2 rounded-lg">
      <h2 @click="toggleEditMode" v-if="!editMode" class="text-xl font-bold mb-2 cursor-pointer">{{ list.listName }}</h2>
      <input
        v-else
        type="text"
        v-model="newListName"
        @keyup.enter="saveListName"
        @blur="saveListName"
        class="mb-2 px-4 py-2 border rounded-lg"
      >
      <button @click="deleteList" class="px-2 py-1 bg-red-500 text-white rounded-lg">
        <i class="fas fa-trash-alt"></i>
      </button>
      <div class="mb-4 flex items-center">
        <input type="text" v-model="newTodo" @keyup.enter="addTodo" placeholder="Enter new todo" class="flex-1 px-4 py-2 border rounded-lg">
        <button @click="addTodo" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <ul class="space-y-2">
        <todo-item
          v-for="(todo, index) in list.todos"
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
      boardName: this.boardData ? this.boardData.boardName : 'My Board',
      lists: this.boardData ? this.boardData.lists : [
        { listName: 'List 1', todos: [] },
      ],
      newListName: '',
      editMode: false,
    };
  },
  methods: {
    deleteList(index) {
      this.lists.splice(index, 1);
    },
    addList() {
      const listName = prompt('Enter new list name:');
      if (listName) {
        this.lists.push({
          listName: listName,
          todos: [],
        });
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveBoard() {
      const boardData = {
        boardName: this.boardName,
        lists: this.lists.map(list => {
          return {
            listName: list.listName,
            todos: list.todos.slice(),
          };
        }),
      };
      localStorage.setItem('board', JSON.stringify(boardData));
      alert('Board saved successfully!');
    },
    exportBoard() {
      const boardData = {
        boardName: this.boardName,
        lists: this.lists.map(list => {
          return {
            listName: list.listName,
            todos: list.todos.slice(),
          };
        }),
      };
      const data = JSON.stringify(boardData);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'board.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    onEnterSaveBoardName(event) {
      if (event.key === 'Enter') {
        this.saveBoardName();
      }
    },
    saveBoardName() {
      if (this.newBoardName) {
        this.boardName = this.newBoardName;
        this.editMode = false;
      }
    },
    loadBoard(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const boardData = JSON.parse(reader.result);
          this.boardName = boardData.boardName;
          this.lists = boardData.lists;
          alert('Board loaded successfully!');
        } catch (error) {
          alert('Error loading board. Please make sure the file is a valid JSON.');
        }
      };

      reader.readAsText(file);
    },
  },
  template: `
    <div>
      <nav class="bg-gray-800 p-4 flex justify-between items-center">
        <h1 @click="toggleEditMode" v-if="!editMode" class="text-white text-3xl font-bold cursor-pointer">{{ boardName }}</h1>
        <input
          v-else
          type="text"
          v-model="newBoardName"
          @keyup.enter="saveBoardName"
          @blur="saveBoardName"
          class="text-white text-3xl font-bold bg-transparent border-none outline-none"
        >
        <div>
          <button @click="saveBoard" class="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Save Board
          </button>
          <button @click="exportBoard" class="px-4 py-2 ml-2 bg-green-500 text-white rounded-lg">
            Export Board
          </button>
          <input type="file" @change="loadBoard" accept=".json" class="hidden">
          <button @click="$refs.fileInput.click()" class="px-4 py-2 ml-2 bg-yellow-500 text-white rounded-lg">
            Load Board
          </button>
        </div>
      </nav>
      <button @click="addList" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg">
        Add List
      </button>
      <div class="flex space-x-4">
        <todo-list
          v-for="(list, index) in lists"
          :key="index"
          :list="list"
          @delete-list="deleteList(index)"
        ></todo-list>

      </div>
    </div>
  `,
});

new Vue({
  el: '#app',
  data() {
    return {
      loading: true,
      boardData: null,
    };
  },
  mounted() {
    this.loadSavedBoard();
    this.loading = false;
  },
  methods: {
    loadSavedBoard() {
      const savedBoard = localStorage.getItem('board');
      if (savedBoard) {
        try {
          this.boardData = JSON.parse(savedBoard);
        } catch (error) {
          console.error('Error loading saved board:', error);
        }
      }
    },
  },
  template: `
    <div class="container mx-auto px-4 py-8">
      <board v-if="!loading" :boardData="boardData" ref="board"></board>
    </div>
  `,
});