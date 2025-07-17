<template>
  <div class="relative overflow-hidden h-[320px] md:h-[400px]">
    <div
      class="absolute bottom-0 w-full h-full"
      :style="{ transform: `translateY(${parallaxOffset}px)` }"
    >
      <img
        :src="bannerUrl"
        alt="Ideas Banner"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <svg class="absolute bottom-0 left-0 w-full" height="100" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
        <polygon points="0,100 1440,0 1440,100" fill="#fff"/>
      </svg>
    </div>
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-white">
      <h1 class="text-5xl font-medium drop-shadow-lg">Ideas</h1>
      <p class="mt-2 text-lg drop-shadow">Where all our great things begin</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const bannerUrl = ref('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80')
const parallaxOffset = ref(0)
const handleScroll = () => {
  const scrollY = window.scrollY
  parallaxOffset.value = scrollY * 0.3
}
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>