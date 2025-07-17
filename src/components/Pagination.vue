<template>
  <nav class="flex justify-center items-center gap-1 text-sm select-none">
    <button
      :disabled="current === 1"
      @click="$emit('change', 1)"
      class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="First page"
    >
      &laquo;
    </button>
    <button
      :disabled="current === 1"
      @click="$emit('change', current - 1)"
      class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Previous page"
    >
      &lsaquo;
    </button>
    <button
      v-for="p in pages"
      :key="p"
      @click="$emit('change', p)"
      :class="[
        'px-3 py-1 rounded border border-gray-300 hover:bg-orange-500 hover:text-white',
        p === current ? 'bg-orange-500 text-white' : '',
        p === '...' ? 'cursor-default border-none hover:bg-transparent' : '',
      ]"
      :disabled="p === '...'"
    >
      {{ p }}
    </button>
    <button
      :disabled="current === totalPages"
      @click="$emit('change', current + 1)"
      class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Next page"
    >
      &rsaquo;
    </button>
    <button
      :disabled="current === totalPages"
      @click="$emit('change', totalPages)"
      class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Last page"
    >
      &raquo;
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['current', 'total', 'perPage'])
const totalPages = computed(() => Math.ceil(props.total / props.perPage))
const pages = computed(() => {
  const arr = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (i <= 3 || i > totalPages.value - 2 || Math.abs(i - props.current) <= 1) arr.push(i)
    else if (arr[arr.length - 1] !== '...') arr.push('...')
  }
  return arr
})
</script>
