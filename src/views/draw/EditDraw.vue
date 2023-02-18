<script setup>
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import { ref } from "vue";
import axios from "@/axios";
import moment from "moment";
import { useHomeStore } from "@/store/home";

const store = useHomeStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const drawNumbers = ref(JSON.parse(route.params.draw));
const machineNumbers = ref(JSON.parse(route.params.machine));

//Save Data
const saveData = async () => {
  try {
    loading.value = true;

    //.......................validation.................................

    //Draw numbers
    for (const drawNumber of drawNumbers.value) {
      if (!drawNumber) return toast.add({severity:'warn', detail: 'Draw numbers must be 5', life: 4000});
      if (drawNumber < 1 || drawNumber > 90) return toast.add({severity:'warn', detail: 'Invalid Numbers', life: 4000});
    }
    if (drawNumbers.value.length !== 5) return toast.add({severity:'warn', summary: 'Error',
      detail: 'Draw numbers should be 5', life: 4000});

    //Machine numbers
    for (const machineNumber of machineNumbers.value) {
      if (!machineNumber) return toast.add({severity:'warn', detail: 'Machine numbers must be 5', life: 4000});
      if (machineNumber < 1 || machineNumber > 90) return toast.add({severity:'warn', detail: 'Invalid Machine Numbers', life: 4000});
    }
    if (machineNumbers.value.length !== 5) return toast.add({severity:'warn', summary: 'Error',
      detail: 'Machine numbers should be 5', life: 4000});

//Send data to server
    const response = await  axios.patch('/admin/draw/numbers',
        JSON.stringify({
          id: route.params.id,
          drawNumbers: drawNumbers.value,
          machineNumbers: machineNumbers.value
        }),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      router.push({name: 'draw'})
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
  }finally { loading.value = false; }
}

</script>


<template>
<div class="container my-5">
  <form @submit.prevent="saveData">
  <div class="row">
    <h3 class="text-center">Edit Draw Numbers</h3>
    <h4 class="text-center mb-3">
      Draw Date: <span class="text-primary">{{ moment(route.params.date).format("MMM Do YYYY") }}</span>
    </h4>
    <div class="col-md-6 my-2">
      <h4 class="text-center">Draw Numbers</h4>
      <div class="text-center">
        <input type="number" min="1" step="1" max="90" v-model.number="drawNumbers[0]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="drawNumbers[1]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="drawNumbers[2]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="drawNumbers[3]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="drawNumbers[4]" class="num-box">
      </div>
    </div>
    <div class="col-md-6 my-2">
      <h4 class="text-center">Machine Numbers</h4>
      <div class="text-center">
        <input type="number" min="1" step="1" max="90" v-model.number="machineNumbers[0]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="machineNumbers[1]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="machineNumbers[2]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="machineNumbers[3]" class="num-box">
        <input type="number" min="1" step="1" max="90" v-model.number="machineNumbers[4]" class="num-box">
      </div>
    </div>
  </div>

    <div class="text-center">
      <Button label="Submit" type="submit" class="p-button-rounded p-button-sm mt-4"
              :loading="loading" loadingIcon="spinner-border spinner-border-sm"/>
    </div>
  </form>
</div>
</template>



<style scoped>
.num-box {
  width: 3.5em;
}
</style>