<script setup>
import { ref } from "vue";
import { useHomeStore } from "@/store/home";
import axios from "@/axios";
import InputSwitch from "primevue/inputswitch";
const store = useHomeStore();
const loading = ref(false)
const checked = ref(true);
const switchElement = ref();

const getGameStatus = async () => {
  try {
   loading.value = true;
    const response = await  axios.get('/admin/game-status',
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      checked.value = response.data.status;
    }
  }catch (e) {
    if (e.response) return  toast.add({severity:'warn', summary: 'Error', detail: e.response.data, life: 4000});

    if (e.request && e.request.status === 0) {
      return  toast.add({
        severity:'error', summary: 'Error',
        detail: 'Sorry, Connection to Server refused. Please check your internet connection or try again later',
        life: 4000});
    }

    return toast.add({severity:'warn', summary: 'Error',
      detail: 'Sorry, something went wrong. Please try again later', life: 4000})
  }finally {  loading.value = false; }
}

getGameStatus();


//Set game status
const setGameStatus = async () => {
  try {
    loading.value = true;
    const response = await  axios.post('/admin/game-status',
        JSON.stringify({status: checked.value}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      return toast.add({severity:'success', detail: 'Game status updated', life: 4000});
    }
  }catch (e) {
    checked.value = !checked.value;
    if (e.response) return  toast.add({severity:'warn', summary: 'Error', detail: e.response.data, life: 4000});

    if (e.request && e.request.status === 0) {
      return  toast.add({
        severity:'error', summary: 'Error',
        detail: 'Sorry, Connection to Server refused. Please check your internet connection or try again later',
        life: 4000});
    }

    return toast.add({severity:'warn', summary: 'Error',
      detail: 'Sorry, something went wrong. Please try again later', life: 4000})
  }finally {  loading.value = false; }
}

</script>

<template>
<div class="text-center mt-3">
  <h3 class="mb-3">Welcome <span class="fw-bold">{{ store.user.displayName || '' }}</span></h3>
  <h4>Game Status</h4>
  <div class="" v-if="loading">
    <h5>Loading..... <span class="spinner-grow spinner-grow-sm"></span></h5>
  </div>
  <div class="" v-else>
    <InputSwitch v-model="checked" ref="switchElement" @change="setGameStatus"/>
    <br>
    <span class="fw-bold" :class="checked === true ? 'text-success' : 'text-danger'">
      {{ checked === true ? 'OPEN' : 'CLOSED' }}
    </span>
  </div>


</div>

</template>

<style scoped>


</style>