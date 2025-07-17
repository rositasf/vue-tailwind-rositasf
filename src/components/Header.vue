<template>
  <header
    :class="[
      'fixed top-0 w-full z-50 transition-transform duration-300',
      'bg-orange-500/95 backdrop-blur',
      showHeader ? 'translate-y-0' : '-translate-y-full'
    ]"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
      <div
        class="group cursor-pointer transition"
        @click="logoClicked = !logoClicked"
      >
        <img
          :src="suitLogo"
          alt="Suitmedia Logo"
          class="h-10 w-auto transition duration-300"
          :class="logoClicked ? 'grayscale-0 invert group-hover:invert-0' : 'grayscale-0 group-hover:invert'"
        />
      </div>
      <nav class="hidden md:flex gap-6 text-sm font-medium">
        <button
          v-for="item in menu"
          :key="item.name"
          class="transition-colors pb-2"
          :class="[
            isActive(item)
              ? 'text-white font-semibold underline underline-offset-8 decoration-white decoration-4'
              : 'text-white/80 hover:text-white hover:underline hover:underline-offset-8 hover:decoration-white hover:decoration-4'
          ]"
          @click="navigateTo(item)"
          @mouseenter="hoveredMenu = item.name"
          @mouseleave="hoveredMenu = null"
        >
          {{ item.name }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import suitLogo from '../assets/images/logo-suitmedia.png'

const menu = [
  { name: 'Work', url: '/Work' },
  { name: 'About', url: '/About' },
  { name: 'Services', url: '/Services' },
  { name: 'Ideas', url: '/Ideas' },
  { name: 'Careers', url: '/Careers' },
  { name: 'Contact', url: '/Contact' },
]

const activeMenu = ref('Ideas')
const hoveredMenu = ref(null)
const logoClicked = ref(false)
const showHeader = ref(true)

const setActive = (name) => {
  activeMenu.value = name
}

const isActive = (item) => {
  return hoveredMenu.value
    ? hoveredMenu.value === item.name
    : activeMenu.value === item.name
}

const navigateTo = (item) => {
  window.history.pushState({}, '', item.url)
  setActive(item.name)
}

let lastScroll = window.scrollY
const handleScroll = () => {
  const curr = window.scrollY
  showHeader.value = curr < 80 || curr < lastScroll
  lastScroll = curr
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  const path = window.location.pathname.replace('/', '')
  const found = menu.find((item) =>
    item.name.toLowerCase() === path.toLowerCase()
  )
  if (found) setActive(found.name)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
img.invert {
  filter: invert(1) hue-rotate(180deg) brightness(1.2);
}
img.invert-0 {
  filter: invert(0);
}
</style>
