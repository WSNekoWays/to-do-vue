<template>
  <div class="container">
    <div class="todo-web">
      <h1>To-Do Web</h1>
      <p class="live-clock">{{ clock }}</p>

      <div class="stat-container">
        <div class="details">
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
          <li v-for="(task, index) in tasks" :key="index" :class="{ completed: task.completed }">
            <input
              type="checkbox"
              v-model="task.completed"
              @change="onTaskToggle(task.completed)"
              class="checkbox"
            />
            <span>{{ task.text }}</span>
            <div class="task-buttons">
              <button class="edit-btn" @click="editTask(index)" :disabled="task.completed">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="delete-btn" @click="deleteTask(index)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>
        <img v-if="tasks.length === 0" :src="noTaskImage" alt="empty task" class="empty-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { confetti } from 'tsparticles-confetti'
import dayjs from 'dayjs'
import ProgressChart from '@/components/ProgressChart.vue'

const newTask = ref('')
const tasks = ref([])

const completedTasks = computed(() => tasks.value.filter(t => t.completed).length)
const totalTasks = computed(() => tasks.value.length)

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

const loadTasks = () => {
  const stored = JSON.parse(localStorage.getItem('tasks'))
  if (stored) tasks.value = stored
}

const addTask = () => {
  if (!newTask.value.trim()) return
  tasks.value.push({ text: newTask.value.trim(), completed: false })
  newTask.value = ''
  saveTasks()
}

const deleteTask = (index) => {
  tasks.value.splice(index, 1)
  saveTasks()
}

const editTask = (index) => {
  newTask.value = tasks.value[index].text
  tasks.value.splice(index, 1)
  saveTasks()
}

const onTaskToggle = (isChecked) => {
  if (isChecked) shootConfetti()
  saveTasks()
}

const clock = ref(dayjs().format('HH:mm:ss'))

onMounted(() => {
  loadTasks()
  setInterval(() => {
    clock.value = dayjs().format('HH:mm:ss')
  }, 1000)
})

const shootConfetti = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
  }

  const shoot = () => {
    confetti({ ...defaults, particleCount: 40, scalar: 1.2 })
    confetti({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ['circle'] })
  }

  shoot()
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}
</script>

<style scoped>
@import "@/assets/style.css";
</style>