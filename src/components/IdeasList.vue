<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="flex flex-wrap items-center justify-between mb-6 gap-6 text-sm text-gray-600">
      <div class="font-medium">
        Showing {{ meta.from }} - {{ meta.to }} of {{ meta.total }}
      </div>

      <div class="flex items-center gap-6">
        <div class="relative">
          <button
            @click="togglePageSizeDropdown"
            class="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-orange-400 hover:ring-2 hover:ring-orange-400"
          >
            Show per page: {{ pageSize }}
          </button>
          <div
            v-if="showPageSizeOptions"
            class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            <div
              v-for="n in [10, 20, 50]"
              :key="n"
              @click="selectPageSize(n)"
              class="px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer text-sm"
            >
              {{ n }}
            </div>
          </div>
        </div>

        <div class="relative">
          <button
            @click="toggleSortDropdown"
            class="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-orange-400 hover:ring-2 hover:ring-orange-400"
          >
            Sort by: {{ sort === '-published_at' ? 'Newest' : 'Oldest' }}
          </button>
          <div
            v-if="showSortOptions"
            class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            <div
              @click="selectSort('-published_at')"
              class="px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer text-sm"
            >Newest</div>
            <div
              @click="selectSort('published_at')"
              class="px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer text-sm"
            >Oldest</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div
        v-for="item in ideas"
        :key="item.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
      >
        <img
          :src="item.small_image || 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d'"
          :alt="item.title"
          class="w-full aspect-[4/3] object-cover rounded-t-lg"
          loading="lazy"
        />

        <div class="p-4 flex-1 flex flex-col">
          <div class="text-xs text-gray-400 uppercase mb-2 tracking-wide">
            {{ formatDate(item.published_at) }}
          </div>
          <div
            class="font-semibold text-gray-900 mb-2 line-clamp-3"
            style="-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;"
            :title="item.title"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>

    <Pagination
      :current="page"
      :total="meta.total"
      :perPage="pageSize"
      @change="goToPage"
      class="mt-10"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Pagination from './Pagination.vue'

const route = useRoute()
const router = useRouter()

const ideas = ref([])
const meta = ref({ from: 0, to: 0, total: 0 })
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.size) || 10)
const sort = ref(route.query.sort || '-published_at')

const showPageSizeOptions = ref(false)
const showSortOptions = ref(false)

const togglePageSizeDropdown = () => {
  showPageSizeOptions.value = !showPageSizeOptions.value
  showSortOptions.value = false
}

const toggleSortDropdown = () => {
  showSortOptions.value = !showSortOptions.value
  showPageSizeOptions.value = false
}

const selectPageSize = (size) => {
  pageSize.value = size
  showPageSizeOptions.value = false
  updateQuery()
}

const selectSort = (val) => {
  sort.value = val
  showSortOptions.value = false
  updateQuery()
}

const fetchIdeas = async () => {
  const params = {
    'page[number]': page.value,
    'page[size]': pageSize.value,
    'append[]': ['small_image', 'medium_image'],
    sort: sort.value,
  }

  const res = await axios.get('/api/ideas', { params })
  const data = res.data
  console.log('small_image:', data.data[0].small_image)
  console.log('medium_image:', data.data[0].medium_image)

  const BASE_URL = 'https://suitmedia-backend.suitdev.com'

  const fallbackImg = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d'
  
  ideas.value = data.data.map(item => {
    const img = item.small_image?.[0]?.url || item.medium_image?.[0]?.url
    const imageAccessible = img && img.startsWith('http') && !img.includes('assets.suitdev.com')
    return {
      ...item,
      small_image: imageAccessible ? img : fallbackImg,
    }
  })

  meta.value = {
    from: (page.value - 1) * pageSize.value + 1,
    to: (page.value - 1) * pageSize.value + ideas.value.length,
    total: data.meta.total,
  }
}

const updateQuery = () => {
  router.replace({
    query: {
      ...route.query,
      page: 1,
      size: pageSize.value,
      sort: sort.value,
    },
  })
}

const goToPage = (p) => {
  router.replace({
    query: {
      ...route.query,
      page: p,
      size: pageSize.value,
      sort: sort.value,
    },
  })
}

watch([() => route.query.page, () => route.query.size, () => route.query.sort], () => {
  page.value = Number(route.query.page) || 1
  pageSize.value = Number(route.query.size) || 10
  sort.value = route.query.sort || '-published_at'
  fetchIdeas()
})

onMounted(fetchIdeas)

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
body {
  position: relative;
}
</style>
