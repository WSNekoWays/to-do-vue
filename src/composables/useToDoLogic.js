// src/composables/useTodoLogic.js
import { ref, computed, onMounted } from 'vue'
import { confetti } from 'tsparticles-confetti'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
// Di bagian atas useTodoLogic.js
import { useTaskStore } from '@/stores/taskStores' // atau sesuai dengan path kamu

export function useTodoLogic() {
    const taskStore = useTaskStore()
    const newTask = ref('')
    const tasks = ref([])
    const customDueDate = ref('')
    const completedTasks = computed(() => tasks.value.filter(t => t.completed).length)
    const totalTasks = computed(() => tasks.value.length)
    const clock = ref(dayjs().format('HH:mm:ss'))
    

    const showModal = ref(false)
    const editIndex = ref(null)
    const editText = ref('')

    const selectedTask = ref(null)

const syncToFirestore = async () => {
  await taskStore.setTasks(tasks.value)  // sync local first
  await taskStore.syncToFirestore()
  alert("✅ Synced to Firebase!")
}

const loadFromFirestore = async () => {
  await taskStore.loadFromFirestore()
  tasks.value = [...taskStore.tasks]
  alert("🔄 Tasks updated from Firebase!")
}
    const openEditModal = (index) => {
        const task = tasks.value[index]
        selectedTask.value = task
        editText.value = task.text
        showModal.value = true
        editDueOption.value =
            task.dueDate === dayjs().add(1, 'day').format('YYYY-MM-DD')
                ? 'tomorrow'
                : task.dueDate === dayjs().add(7, 'day').format('YYYY-MM-DD')
                    ? 'nextWeek'
                    : ''
    }
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks.value))
    }

    const editDueOption = ref('') // 'tomorrow', 'nextWeek', etc.

    const setDueDateFromOption = () => {
        if (!selectedTask.value) return
        const now = dayjs()

        switch (editDueOption.value) {
            case 'today':
                selectedTask.value.dueDate = now.format('YYYY-MM-DD')
                break
            case 'tomorrow':
                selectedTask.value.dueDate = now.add(1, 'day').format('YYYY-MM-DD')
                break
            case 'nextWeek':
                selectedTask.value.dueDate = now.add(7, 'day').format('YYYY-MM-DD')
                break
            case 'custom':
                if (customDueDate.value) {
                    selectedTask.value.dueDate = customDueDate.value
                } else {
                    selectedTask.value.dueDate = null
                }
                break
            default:
                selectedTask.value.dueDate = null
        }
    }

    const formatDate = (dateStr) => {
        return dayjs(dateStr).format('DD MMM YYYY')
    }

    const loadTasks = () => {
        const stored = JSON.parse(localStorage.getItem('tasks'))
        if (stored) tasks.value = stored
    }

    const toggleStar = (task) => {
        task.starred = !task.starred
        saveTasks()
    }

    const sortedTasks = computed(() => {
        return [...tasks.value].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1
            if (a.starred !== b.starred) return a.starred ? -1 : 1
            return 0
        })
    })

    const addTask = () => {
        if (!newTask.value.trim()) return
        tasks.value.push({
            id: nanoid(6),
            text: newTask.value.trim(),
            completed: false,
            starred: false,
            dueDate: null

        })
        newTask.value = ''
        saveTasks()
    }
    const onTaskClick = (index, event) => {
        const target = event.target
        if (target.tagName === 'INPUT' || target.closest('.checkbox-text')) return
        openEditModal(index)
    }
    const deleteTask = () => {
        if (!selectedTask.value) return
        const originalIndex = tasks.value.findIndex(t => t.id === selectedTask.value.id)
        if (originalIndex !== -1) {
            tasks.value.splice(originalIndex, 1)
            saveTasks()
            closeModal()
        }
    }


    const closeModal = () => {
        showModal.value = false
        editText.value = ''
        selectedTask.value = null
        editDueOption.value = ''
        customDueDate.value = ''
    }

    const updateTask = () => {
        if (selectedTask.value && editText.value.trim()) {
            selectedTask.value.text = editText.value.trim()
            setDueDateFromOption()
            saveTasks()
            closeModal()
        }
    }

    const onTaskToggle = (isChecked) => {
        if (isChecked) shootConfetti()
        saveTasks()
    }

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

    onMounted(() => {
        loadTasks()
        setInterval(() => {
            clock.value = dayjs().format('HH:mm:ss')
        }, 1000)
    })

    return {
        newTask,
        tasks,
        completedTasks,
        totalTasks,
        clock,
        addTask,
        deleteTask,
        openEditModal,
        closeModal,
        onTaskClick,
        updateTask,
        editText,
        syncToFirestore,
        loadFromFirestore,
        showModal,
        onTaskToggle,
        toggleStar,
        editDueOption,
        customDueDate,
        formatDate,
        sortedTasks
    }
}