<script setup>
import {onMounted, reactive, ref} from "vue";
import Button from "primevue/button";
import axios from "../../axios.js";
import { useHomeStore } from "@/store/home";

const store = useHomeStore();
const loading = ref(false);

let formData = reactive({
   numbers: [], date: null
});

//On mounted Hook
onMounted(() => {
  const numbers = document.querySelectorAll(".numbers-ball");
  for (const number of numbers) {
    number.onclick = function(e){
      if (e.target.classList.contains('active')){
        e.target.classList.remove('active');
        formData.numbers = formData.numbers.filter(num => num !== parseInt(e.target.innerText));
      }
      else if (formData.numbers.length < 10 && !e.target.classList.contains('active')){
        e.target.classList.add('active');
        return formData.numbers.push(parseInt(e.target.innerText));
      }
      else if (formData.numbers.length > 9 && !e.target.classList.contains('active'))
        return  toast.add({severity:'warn', summary: 'Sorry!', detail:'You cannot select more than 10 numbers', life: 4000});
    }
  }
})

//Save draw numbers
const saveData = async () => {
  const numbers = document.querySelectorAll(".numbers-ball");
  try {

    loading.value = true;
    const response = await  axios.post('/admin/draw/numbers',
        JSON.stringify(formData),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
       toast.add({severity:'success', summary: 'Success', detail: 'Record Saved Successfully', life: 4000});
    }

    formData.date = null;
    formData.numbers = [];
    for (const number of numbers) {
      if (number.classList.contains('active')) {
        number.classList.remove('active');
      }
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

  <div class="col p-3" style="background: rgba(231,101,239,0.61);">
    <div class="numbers-ball-container">
      <template v-for="num in 90">
        <div class="numbers-ball">{{ num }}</div>
      </template>
    </div>
  </div>

<div class="container-fluid mb-5">
      <!-- ............. Numbers ............... -->
      <div class="row justify-content-center">

        <form @submit.prevent="saveData">
          <div class="row text-center" v-if="formData.numbers.length">

            <!--      Draw Numbers-->
            <div class="col-md-6" style="border: 1px solid #ccc">
              <h6 class="mt-3">Draw Numbers</h6>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[0]">{{ formData.numbers[0] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[1]">{{ formData.numbers[1] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[2]">{{ formData.numbers[2] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[3]">{{ formData.numbers[3] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[4]">{{ formData.numbers[4] }}</div>
            </div>

          <!--     Machine Numbers       -->
            <div class="col-md-6" style="border: 1px solid #ccc">
              <h6 class="mt-3">Machine Numbers</h6>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[5]">{{ formData.numbers[5] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[6]">{{ formData.numbers[6] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[7]">{{ formData.numbers[7] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[8]">{{ formData.numbers[8] }}</div>
                <div class="numbers-ball-selected d-inline-flex" v-if="formData.numbers[9]">{{ formData.numbers[9] }}</div>
            </div>
          </div>

          <div class="row justify-content-center mt-3">
            <div class="col-sm-6 col-lg-4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">Date</div>
                </div>
                <input type="date" class="form-control" v-model="formData.date" onkeydown="return false">
              </div>
            </div>
          </div>

          <div class="row justify-content-center mt-3">
            <div class="col-sm-6 col-lg-3">
              <Button label="Submit" type="submit" class="p-button-rounded p-button-sm w-100"
                      :loading="loading" loadingIcon="spinner-border spinner-border-sm"
                      v-if="formData.numbers.length === 10"/>
          </div>
          </div>

        </form>
      </div>

</div>
</template>


<style scoped>
.numbers-ball-container {
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.numbers-ball, .numbers-ball-selected {
  cursor: pointer;
  background-color: #fff;
  width: 35px;
  height: 35px;
  border-radius: 20px;
  text-align: center;
  align-items: center;
  display: flex;
  margin: 10px 8px 10px 0;
  justify-content: center;
  font-size: 19px;
  font-weight: bold;
  color: #2f3e4a;
  user-select: none;
}
.numbers-ball:hover {
  background: antiquewhite;
}
.numbers-ball.active, .numbers-ball-selected{
  background-color: #e30c07;
  color: #fff;
}
</style>