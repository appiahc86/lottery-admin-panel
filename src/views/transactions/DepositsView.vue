<script setup>
import {ref} from "vue";
import Button from 'primevue/button';
import axios from "../../axios";
import { useHomeStore } from "@/store/home";
import {formatNumber} from "@/functions";


const store = useHomeStore();
const loading = ref(false);
const phoneNumber = ref();
const amount = ref(null);
const dialog = ref(null);
const userRecord = ref(null);

//Validate phone number
const validatePhoneNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
}

//Number Lookup
const lookup = async () => {
  try {

    // validation
    if (phoneNumber.value.toString().length  !== 9 ){
      return toast.add({severity:'warn', summary: 'Error',
        detail: `Please check phone number`,
        life: 4000});
    }
    if (amount.value < 1) return toast.add({severity:'warn', detail: `Minimum amount should be 1`, life: 4000});


    loading.value = true;

    const response = await  axios.post('/admin/transactions/deposit/lookup',
        {
          phoneNumber: phoneNumber.value
        },
        {
          headers: {'Authorization': `Bearer ${store.token}`}
        }

    )

    if (response.status === 200){
      userRecord.value = response.data.data;
      openDialog();
    }

  }catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: `${e.response.data}`, life: 4000});
    if (e.request && e.request.status === 0) {
      return toast.add({severity:'error', summary: 'Error',
        detail: `Sorry, Connection to Server refused. Please check your internet connection or try again later`,
        life: 4000});
    }

    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later',
      life: 4000});
  }finally { loading.value = false; }

}


//Deposit

const deposit = async () => {
  try {

    // validation
    if (phoneNumber.value.toString().length  !== 9 ){
      return toast.add({severity:'warn', summary: 'Error',
        detail: `Please check phone number`,
        life: 4000});
    }
    if (amount.value < 1) return toast.add({severity:'warn', detail: `Minimum amount should be 1`, life: 4000});


    loading.value = true;

    const response = await  axios.post('/admin/transactions/deposit/',
        {
          userId: userRecord.value.id,
          amount: amount.value
        },
        {
          headers: {'Authorization': `Bearer ${store.token}`}
        }

    )

    if (response.status === 200){
      userRecord.value = null;
      amount.value = null;
      phoneNumber.value = null;
      dialog.value.close();
      toast.add({severity:'success', detail: `Success`, life: 4000});
    }

  }catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: `${e.response.data}`, life: 4000});
    if (e.request && e.request.status === 0) {
      return toast.add({severity:'error', summary: 'Error',
        detail: `Sorry, Connection to Server refused. Please check your internet connection or try again later`,
        life: 4000});
    }

    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later',
      life: 4000});
  }finally { loading.value = false; }

}

//open dialog
const openDialog = () => {
  dialog.value.showModal();
}

</script>

<template>
  <div class="container">
    <div class="centered">
      <h4>MAKE A DEPOSIT</h4>
      <form @submit.prevent="lookup">
        <input type="tel" class="form-control shadow-none mb-3" maxlength="10"
               v-model.number="phoneNumber" @input="validatePhoneNumber" placeholder="Phone number" required>
        <input type="number" class="form-control mb-3 shadow-none" min="1" step="0.01"
               v-model.number="amount" placeholder="Amount" required>
        <Button label="Submit" type="submit"
                class="p-button-rounded mt-3 play-game fw-bold"
                :loading="loading" loadingIcon="spinner-border spinner-border-sm"
        />

      </form>
    </div>


<!--  Dialog -->
    <dialog ref="dialog" class="border-0 p-5 w-50">
      <template v-if="userRecord">

        <h6 class="text-center my3">
          You are about to credit this user's account with <b>{{ formatNumber(amount) }}</b>
        </h6>

        <div class="col-lg-9">
          <div>Number: <span class="fw-bold">0{{ userRecord.phone }}</span></div>
          <div>Name: <span class="fw-bold">{{ userRecord.name }}</span></div>
          <div>Balance: <span class="fw-bold">{{ formatNumber(userRecord.balance)}}</span></div>
          <div>Network: <span class="fw-bold text-capitalize">{{ userRecord.network }}</span></div>

        </div>

      </template>

      <div class="text-center">
        <button class="btn btn-secondary btn-sm mx-3 mb-2" @click="dialog.close()">Cancel</button>
        <button class="btn btn-success btn-sm mb-2" @click="deposit" :disabled="loading">
          <span class="spinner-border spinner-border-sm" v-if="loading"></span>&nbsp;
          Proceed
        </button>
      </div>
    </dialog>

  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

</style>