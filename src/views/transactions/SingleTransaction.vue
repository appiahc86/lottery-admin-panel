<script setup>
import {reactive, ref} from "vue";
import axios from "@/axios";
import { useHomeStore } from "@/store/home";
import { formatNumber } from "@/functions";

const store = useHomeStore();
const searchTerm = ref(null);
const loading = ref(false);
const submitting = ref(false);
const markAsSuccessfulDialog = ref();
const markAsFailedDialog = ref();
const transaction = reactive({localTransaction: '', gatewayResponse: ''});

//Search transaction
const search = async () => {
  try {
    submitting.value = true;
    transaction.transaction = '';
    transaction.gatewayResponse = '';
    const response = await  axios.post('/admin/transactions/single',
        JSON.stringify({reference: searchTerm.value}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      transaction.localTransaction = response.data.localTransaction;
      transaction.gatewayResponse = response.data.gatewayResponse;
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
  }finally { submitting.value = false }
}



//Mark transaction As Successful
const markAsSuccessful = async () => {
  try {
    loading.value = true;
    const response = await  axios.post('/admin/transactions/mark-as-successful',
        JSON.stringify({id: transaction.localTransaction.id}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      markAsSuccessfulDialog.value.close();
      toast.add({severity:'success', summary: 'Success', detail: `Operation was successful`, life: 4000});
      transaction.localTransaction = '';
      transaction.gatewayResponse = '';
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



//Mark Transaction as failed
const markAsFailed = async () => {
  try {
    loading.value = true;
    const response = await  axios.post('/admin/transactions/mark-as-failed',
        JSON.stringify({id: transaction.localTransaction.id}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      markAsFailedDialog.value.close();
      toast.add({severity:'success', summary: 'Success', detail: `Operation was successful`, life: 4000});
      transaction.localTransaction = '';
      transaction.gatewayResponse = '';
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
  }finally {  }
}


//open Mark as successful dialog
const openMarkAsSuccessfulDialog = () => markAsSuccessfulDialog.value.showModal();

//open Mark as failed dialog
const openMarkAsFailedDialog = () => markAsFailedDialog.value.showModal();

</script>


<template>
<div class="container my-4">
  <div class="row justify-content-center">
    <h3 class="text-center mb-3">Verify Transaction from Gateway</h3>
    <div class="col-md-6 col-lg-5">

        <form @submit.prevent="search">
          <div class="input-group">
            <input type="search" class="p-inputtext p-inputtext-sm" v-model.trim="searchTerm"
                   placeholder="Reference No." required spellcheck="false" style="width: 85%;">
            <button type="submit" class="p-button p-button-sm " :disabled="submitting">
              <span :class="submitting ? 'spinner-border spinner-border-sm' : 'pi pi-search'"></span>
            </button>
          </div>
        </form>

    </div>
  </div>

  <div class="row justify-content-center mt-5">
    <div class="col-md-7">

      <!--   Transaction Record   -->
      <template v-if="transaction.gatewayResponse">
        <div class="table-responsive">
          <table class="table table-bordered">
            <tr>
              <th>User</th>
              <td>0{{ transaction.localTransaction.phone }}</td>
            </tr>
            <tr>
              <th>Reference No.</th>
              <td>{{ transaction.gatewayResponse.reference }}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td class="text-capitalize">{{ transaction.localTransaction.transactionType }}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{{ formatNumber(transaction.localTransaction.amount) }}</td>
            </tr>
            <tr>
              <th>Local Status</th>
              <td class="text-capitalize">{{ transaction.localTransaction.status }}</td>
            </tr>
            <tr class="bg-info">
              <th>Gateway Status</th>
              <td class="text-capitalize"><b>{{ transaction.gatewayResponse.status }}</b></td>
            </tr>
            <tr>
              <th>Date</th>
              <td>  {{ new Date(transaction.localTransaction.createdAt).toLocaleDateString() }}
                {{ new Date(transaction.localTransaction.createdAt).toLocaleTimeString() }}
              </td>
            </tr>
          </table>
        </div>

        <div class="text-center mt-3">
          <template v-if="transaction.localTransaction.status === 'pending' && transaction.gatewayResponse.status === 'success'">
            <button class="btn btn-sm btn-success" @click="openMarkAsSuccessfulDialog">
              Mark As Successful</button> &nbsp;
          </template>

         <template v-if="transaction.localTransaction.status === 'pending' && transaction.gatewayResponse.status === 'failed'">
           <button class="btn btn-sm btn-danger"  @click="openMarkAsFailedDialog">
             Mark As Failed</button>
         </template>

        </div>

      </template>


    </div>
  </div>
</div>


<!--  mark as successful dialog -->
  <dialog ref="markAsSuccessfulDialog" class="border-0 p-5">
    <h6 class="text-center my3">Mark this transaction as successful?</h6>
    <div class="text-center">
      <button class="btn btn-secondary btn-sm mx-3" @click="markAsSuccessfulDialog.close()">Cancel</button>
      <button class="btn btn-success btn-sm" @click="markAsSuccessful" :disabled="loading">
        <span class="spinner-border spinner-border-sm" v-if="loading"></span>&nbsp;
        Proceed
      </button>
    </div>
  </dialog>

  <!--  mark as failed dialog -->
  <dialog ref="markAsFailedDialog" class="border-0 p-5">
    <h6 class="text-center my3">Mark this transaction as Failed?</h6>
    <div class="text-center">
      <button class="btn btn-secondary btn-sm mx-3" @click="markAsFailedDialog.close()">Cancel</button>
      <button class="btn btn-success btn-sm" @click="markAsFailed" :disabled="loading">
        <span class="spinner-border spinner-border-sm" v-if="loading"></span>&nbsp;
        Proceed
      </button>
    </div>
  </dialog>

</template>


<style scoped>

</style>