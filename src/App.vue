<script setup>
import { ref, computed } from 'vue';
import Task from './components/Task.vue';
import Filter from './components/Filter.vue';
import ModalWindow from './components/modal/ModalWindow.vue';
import AddTaskModal from './components/modal/AddTaskModal.vue';
import { useTasksStore } from './stores/tasksStore.js';

const appName = ref("My new task manager");
const store = useTasksStore();
let filterBy = ref("");
let modalIsActive = ref(false);
let newTask = { completed: false };

const filteredTasks = computed(() => {
  switch (filterBy.value) {
    case 'todo':
      return store.tasks.filter(task => !task.completed);
    case 'done':
      return store.tasks.filter(task => task.completed)
    default:
      return store.tasks;
  }
})

function addTask() {
  if (newTask.name && newTask.description) {
    newTask.id = Math.max(...store.tasks.map(task => task.id)) + 1;
    store.tasks.push(newTask);
    newTask = { completed: false };
  } else {
    alret("Please enter the title and description for the task.");
  }
}

function toggleCompleted(id) {
  store.tasks.forEach(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
}

function setFilter(value) {
  filterBy.value = value;
}
</script>

<template>
  <main class="container">
    <div class="header">
      <div class="header-side">
        <h1>
          {{ appName }}
        </h1>
      </div>
      <div class="header-side">
        <button @click="modalIsActive = true" class="btn secondary">+ Add Task</button>
      </div>
      <input type="text" v-model="appName">
    </div>

    <Filter :filterBy="filterBy" @setFilter="setFilter" />

    <div class="tasks">
      <Task @toggleCompleted="toggleCompleted" v-for="(task, index) in filteredTasks" :task="task" :key="index" />
    </div>

    <ModalWindow @closePopup="modalIsActive = false" v-if="modalIsActive">
      <AddTaskModal/>
    </ModalWindow>
  </main>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-side {
    display: flex;
    align-items: center;

    h1 {
      text-transform: capitalize;
      font-size: 42px;
      font-weight: 700;
      line-height: 47px;
      letter-spacing: 0em;
      text-align: left;
    }

    .secondary {
      margin-left: 12px;
    }
  }

}

.tasks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.add-task {
  margin-top: 60px;

  input,
  textarea {
    width: 360px;
    max-width: 100%;
    margin-top: 12px;
    padding: 5px;
  }

  button {
    width: 360px;
    margin-top: 12px;
  }
}
</style>
