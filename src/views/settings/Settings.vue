<script setup>
import { ref } from "vue";
import {useHomeStore} from "@/store/home";
import InputSwitch from "primevue/inputswitch";
import axios from "@/axios";

const store = useHomeStore();
const gameStatusCheck = ref(true);
const loading = ref(false);
const withdrawalStatusCheck = ref(true);
const depositStatusCheck = ref(true);


const getSettings = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/settings',
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
     gameStatusCheck.value = !!response.data.gameStatus;
     depositStatusCheck.value = !!response.data.deposits;
     withdrawalStatusCheck.value = !!response.data.withdrawals;
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

getSettings();


//Set game status
const setGameStatus = async () => {
  try {
    loading.value = true;
    const response = await  axios.post('/admin/settings/game-status',
        JSON.stringify({status: gameStatusCheck.value}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      console.clear();
    }
  }catch (e) {
    gameStatusCheck.value = !gameStatusCheck.value;
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



//Set withdrawal status
const setWithdrawalStatus = async () => {
  try {
    loading.value = true;
    const response = await  axios.post('/admin/settings/withdrawal-status',
        JSON.stringify({status: withdrawalStatusCheck.value}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
     console.clear();
    }
  }catch (e) {
    withdrawalStatusCheck.value = !withdrawalStatusCheck.value;
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

//Set Deposit status
const setDepositStatus = async () => {
  try {
    loading.value = true;
    const response = await  axios.post('/admin/settings/deposit-status',
        JSON.stringify({status: depositStatusCheck.value}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      console.clear();
    }
  }catch (e) {
    depositStatusCheck.value = !depositStatusCheck.value;
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
  <div class="container my-5">
    <div class="row">
<!--      Game status -->
      <div class="col-md-4">
        <div class="card shadow p-4">
          <div class="text-center mt-3">
            <h6>Game Status</h6>
            <div v-if="loading" class="mt-3">
              <h6 class="text-center">Please Wait ... <span class="spinner-border spinner-border-sm"></span></h6>
            </div>
            <div v-else>
              <InputSwitch v-model="gameStatusCheck" @change="setGameStatus"/>
              <br>
              <span class="fw-bold" :class="gameStatusCheck === true ? 'text-success' : 'text-danger'">
                {{ gameStatusCheck === true ? 'OPEN' : 'CLOSED' }}
              </span>
            </div>
          </div>
        </div>
      </div>

<!--      Allow Withdrawals -->
      <div class="col-md-4">
        <div class="card shadow p-4">
          <div class="text-center mt-3">
            <h6>Allow Withdrawals</h6>
            <div v-if="loading" class="mt-3">
              <h6 class="text-center">Please Wait ... <span class="spinner-border spinner-border-sm"></span></h6>
            </div>
            <div v-else>
              <InputSwitch v-model="withdrawalStatusCheck" ref="gameStatusSwitch" @change="setWithdrawalStatus"/>
              <br>
              <span class="fw-bold" :class="withdrawalStatusCheck === true ? 'text-success' : 'text-danger'">
                {{ withdrawalStatusCheck === true ? 'YES' : 'No' }}
              </span>
            </div>
          </div>
        </div>
      </div>


      <!--      Allow Deposits -->
      <div class="col-md-4">
        <div class="card shadow p-4">
          <div class="text-center mt-3">
            <h6>Allow Deposits</h6>
            <div v-if="loading" class="mt-3">
              <h6 class="text-center">Please Wait ... <span class="spinner-border spinner-border-sm"></span></h6>
            </div>
            <div v-else>
              <InputSwitch v-model="depositStatusCheck" ref="gameStatusSwitch" @change="setDepositStatus"/>
              <br>
              <span class="fw-bold" :class="depositStatusCheck === true ? 'text-success' : 'text-danger'">
                {{ depositStatusCheck === true ? 'YES' : 'No' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>



<style scoped>

</style>