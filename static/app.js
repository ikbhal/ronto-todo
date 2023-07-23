Vue.component('todo-list', {
  data() {
    return {
      todos: [],
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
  created() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
    }
  },
  watch: {
    todos: {
      handler() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
      },
      deep: true,
    },
  },
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-4">Todo App</h1>
      <div class="mb-4 flex items-center">
        <input type="text" v-model="newTodo" @keyup.enter="addTodo" placeholder="Enter new todo" class="flex-1 px-4 py-2 border rounded-lg">
        <button @click="addTodo" class="px-4 py-2 ml-2 bg-blue-500 text-white rounded-lg">
          <i class="fas fa-plus"></i> <!-- Font Awesome Add Icon -->
        </button>
      </div>
      <ul class="space-y-2">
        <li v-for="(todo, index) in todos" :key="index" :class="{ 'line-through': todo.completed }" class="bg-gray-100 p-2 rounded-lg">
          <span>
            <i @click="toggleCompleted(index)" :class="['fas', todo.completed ? 'fa-check-circle' : 'fa-circle', 'mr-2', 'cursor-pointer']"></i>
            <i @click="deleteTodo(index)" class="fas fa-trash-alt"></i>
            {{ todo.text }}
          </span>
        </li>
      </ul>
    </div>
  `,
});

// Create the Vue instance
new Vue({
  el: '#app',
  template: `<todo-list></todo-list>`,
});
