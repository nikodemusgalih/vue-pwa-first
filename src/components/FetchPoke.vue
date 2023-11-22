<template>
    <div>
      <h1>{{ title }}</h1>
      <ul>
        <li v-for="item in items" :key="item.url">{{ item.name }}</li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // Define reactive variables
  const title = ref('Fetching Data Example');
  const items = ref([]);
  
  defineProps({
    offset: String,
    limit: String,
  })
  // Define a function to fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon');
      // const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset= {offset}}&limit={{limit}}');
      if (response.ok) {
        const data = await response.json();
        items.value = data.results;
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  // Call fetchData when the component is mounted
  onMounted(fetchData);
  </script>