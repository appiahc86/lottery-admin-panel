<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import axios from "../../axios.js";
import { useHomeStore } from "@/store/home";

const store = useHomeStore();
const loading = ref(false);

const drawNumbers = ref([null, null, null, null, null]);
const machineNumbers = ref([null, null, null, null, null]);
const date = ref("");


//Save draw numbers
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
    const response = await  axios.post('/admin/draw/numbers',
        JSON.stringify({
          date: date.value,
          drawNumbers: drawNumbers.value,
          machineNumbers: machineNumbers.value
        }),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      drawNumbers.value = [null, null, null, null, null];
      machineNumbers.value = [null, null, null, null, null];
      date.value = '';
       toast.add({severity:'success', summary: 'Success', detail: 'Record Saved Successfully', life: 4000});
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
        <h3 class="text-center">Enter Draw Numbers</h3>

        <div class="col-md-6 my-2">
          <h4 class="text-center text-danger">Draw Numbers</h4>
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
        <b>Date </b><input type="date" onkeydown="return false;" v-model="date" class="mt-3 p-datepicker"><br><br>
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