import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])

  const setTasks = (newTasks) => {
    tasks.value = newTasks
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const addTask = (task) => {
    tasks.value.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  const syncToFirestore = async () => {
    const colRef = collection(db, 'tasks')
    for (const task of tasks.value) {
      const docRef = doc(colRef, task.id)
      await setDoc(docRef, task)
    }
  }

  const loadFromFirestore = async () => {
    const colRef = collection(db, 'tasks')
    const snapshot = await getDocs(colRef)
    const firebaseTasks = []
    snapshot.forEach(doc => {
      firebaseTasks.push(doc.data())
    })
    tasks.value = firebaseTasks
    localStorage.setItem('tasks', JSON.stringify(firebaseTasks))
  }

  const loadFromLocal = () => {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      tasks.value = JSON.parse(stored)
    }
  }

  return {
    tasks,
    setTasks,
    addTask,
    syncToFirestore,
    loadFromFirestore,
    loadFromLocal,
  }
})