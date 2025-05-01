import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";

export const useTasksStore = defineStore('tasks', () => {
  let tasks = reactive(JSON.parse(localStorage.getItem('tasks')) || []);

  let filterBy = ref("");
  let modalIsActive = ref(false);

  const filteredTasks = computed(() => {
    switch (filterBy.value) {
      case 'todo':
        return tasks.filter(task => !task.completed);
      case 'done':
        return tasks.filter(task => task.completed)
      default:
        return tasks;
    }
  })

  function setFilter(value) {
    filterBy.value = value;
  }

  function addTask(newTask) {
    if (newTask.name && newTask.description) {
      newTask.id = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
      tasks.push(newTask);
      closeModal();
    } else {
      alret("Please enter the title and description for the task.");
    }
  }
  
  function toggleCompleted(id) {
    tasks.forEach(task => {
      if (task.id === id) {
        task.completed = !task.completed;
      }
    });
  }

  function openModal() {
    modalIsActive.value = true;
  }

  function closeModal() {
    modalIsActive.value = false;
  }

  return { tasks, filterBy, modalIsActive, filteredTasks, setFilter, addTask, toggleCompleted, openModal, closeModal }
});
