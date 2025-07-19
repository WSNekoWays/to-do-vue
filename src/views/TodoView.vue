<template>
  <div class="container">
    <div class="todo-web">
      <h1>To-Do Web</h1>
      <div class="firebase-buttons">
  <button @click="syncToFirestore" class="firebase-btn">🔼 Sync to Firebase</button>
  <button @click="loadFromFirestore" class="firebase-btn">🔄 Update from Firebase</button>
</div>
      <p class="live-clock">{{ clock }}</p>

      <div class="stat-container">
        <div class="details" v-if="totalTasks > 0">
          <h3>Keep it Up!</h3>
          <ProgressChart :completed="completedTasks" :total="totalTasks" />
        </div>
      </div>

      <form class="input-area" @submit.prevent="addTask">
        <input type="text" v-model="newTask" placeholder="Add a new task..." />
        <button type="submit"><i class="fa-solid fa-plus"></i></button>
      </form>

      <div class="todos-container" :style="{ width: tasks.length > 0 ? '100%' : '50%' }">
        <ul id="task-list">
          <li v-for="(task, index) in sortedTasks" :key="task.id" :class="{ completed: task.completed }"
            class="task-card">
            <div class="task-content">
              <!-- ✅ Checkbox ONLY toggles, doesn't open modal -->
              <input type="checkbox" v-model="task.completed" @change="onTaskToggle(task.completed)" @click.stop />

              <!-- ✅ Clicking this opens the modal -->
              <div class="task-text-area" @click="onTaskClick(index, $event)">
                <span class="task-title">{{ task.text }}</span>
                <small v-if="task.dueDate" class="due-date">📅 {{ formatDate(task.dueDate) }}</small>
              </div>

              <!-- ✅ Star button toggles star only -->
              <button class="star-btn" @click.stop="toggleStar(task)">
                <i :class="task.starred ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
              </button>
            </div>
          </li>
        </ul>
        <img v-if="tasks.length === 0" :src="noTaskImage" alt="empty task" class="empty-image" />
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h3>Edit Task</h3>
      <input type="text" v-model="editText" />

      <div class="dropdown">
        <label>Due Date:</label>
        <select v-model="editDueOption">
          <option value="">None</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="nextWeek">Next Week</option>
          <option value="custom">Choose Date</option>
        </select>

        <input v-if="editDueOption === 'custom'" type="date" v-model="customDueDate" class="custom-date-picker" />
      </div>

      <div class="modal-buttons">
        <button @click="updateTask">Save</button>
        <button class="delete-btn" @click="deleteTask">Delete</button>
        <button class="cancel-btn" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { useTodoLogic } from '@/composables/useTodoLogic'
import ProgressChart from '@/components/ProgressChart.vue'
import noTaskImage from '@/assets/no-task.svg'

const {
  newTask,
  tasks,
  completedTasks,
  totalTasks,
  clock,
  addTask,
  deleteTask,
  editTask,
  sortedTasks,
  onTaskToggle,
  showModal,
  editText,
  editDueOption,
  syncToFirestore,
  loadFromFirestore,
  formatDate,
  openEditModal,
  closeModal,
  toggleStar,
  updateTask,
  onTaskClick,
  customDueDate,
} = useTodoLogic()


</script>

<style scoped>
@import "@/assets/style.css";
</style>