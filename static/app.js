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
  data() {
    return {
      boardName: 'My Board',
      lists: [
        {
          listName: 'List 1',
          todos: [
            { text: 'Todo 1 for List 1', completed: false },
            { text: 'Todo 2 for List 1', completed: true },
            { text: 'Todo 3 for List 1', completed: false },
          ],
        },
        {
          listName: 'List 2',
          todos: [
            { text: 'Todo 1 for List 2', completed: true },
            { text: 'Todo 2 for List 2', completed: false },
            { text: 'Todo 3 for List 2', completed: true },
          ],
        },
        {
          listName: 'List 3',
          todos: [
            { text: 'Todo 1 for List 3', completed: false },
            { text: 'Todo 2 for List 3', completed: false },
            { text: 'Todo 3 for List 3', completed: true },
          ],
        },
      ],
      newListName: '',
    };
  },
  methods: {
    addList() {
      if (this.newListName) {
        this.lists.push({
          listName: this.newListName,
          todos: [],
        });
        this.newListName = '';
      }
    },
    deleteList(index) {
      this.lists.splice(index, 1);
    },
    saveBoard() {
      const boardData = {
        boardName: this.boardName,
        lists: this.lists,
      };
      localStorage.setItem('boardData', JSON.stringify(boardData));
      alert('Board saved successfully!');
    },
    exportBoard() {
      const boardData = {
        boardName: this.boardName,
        lists: this.lists,
      };
      const jsonData = JSON.stringify(boardData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'board_data.json';
      a.click();
      URL.revokeObjectURL(url);
    },
  },
  created() {
    const savedData = localStorage.getItem('boardData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.boardName = parsedData.boardName;
      this.lists = parsedData.lists;
      alert('Board data loaded from local storage.');
    }
  },
  template: `
    <div>
      <h1 class="text-3xl font-bold mb-4">{{ boardName }}</h1>
      <div class="flex mb-4">
        <input
          type="text"
          v-model="newListName"
          @keyup.enter="addList"
          placeholder="Enter new list name"
          class="px-4 py-2 border rounded-lg"
        >
        <button @click="addList" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
          Add List
        </button>
        <button @click="saveBoard" class="px-4 py-2 ml-2 bg-green-500 text-white rounded-lg">
          Save Board
        </button>
        <button @click="exportBoard" class="px-4 py-2 ml-2 bg-yellow-500 text-white rounded-lg">
          Export Board
        </button>
      </div>
      
      <div class="flex space-x-4">
        <todo-list
          v-for="(list, index) in lists"
          :key="index"
          :listName="list.listName"
          :todos="list.todos"
          @delete-list="deleteList(index)"
        ></todo-list>
      </div>
      
    </div>
  `,
});

new Vue({
  el: '#app',
  template: `
    <div class="container mx-auto px-4 py-8">
      <board></board>
    </div>
  `,
});
