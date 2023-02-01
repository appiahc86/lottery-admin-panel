<script setup>
import { useHomeStore } from "@/store/home";
const store = useHomeStore();

</script>

<template>

<h3>Welcome <span class="fw-bold">{{ store.user.displayName || '' }}</span></h3>

</template>

<style scoped>


</style>