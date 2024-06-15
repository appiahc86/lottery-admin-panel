<script setup>
import {ref} from "vue";
import axios from "@/axios";
import { useHomeStore } from "@/store/home";
import { formatNumber } from "@/functions";
import moment from "moment";

const store = useHomeStore();
const referenceNumber = ref(null);
const loading = ref(false);
const recordNotFound = ref(false);
const record = ref(null);
const approveDialog = ref(null);
const declineDialog = ref(null);

//Search transaction
const search = async () => {
  try {

    recordNotFound.value = false;
    record.value = null;
    loading.value = true;

    const response = await  axios.post('/admin/transactions/search-single',
        {referenceNumber: referenceNumber.value},
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      record.value = response.data.data;
      if (!!response.data.data === false) recordNotFound.value = true;
      // referenceNumber.value = null;
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
  }finally { loading.value = false }
}


//Approve withdrawal
const approve = async () => {
  try {

    loading.value = true;
    const response = await  axios.post('/admin/transactions/withdrawals/approve',
        {
          id: record.value.id,
        },
        {
          headers: {'Authorization': `Bearer ${store.token}`}
        }

    )

    if (response.status === 200){
      approveDialog.value.close();
      record.value = null;
      return toast.add({severity:'success', summary: 'success',
        detail: `Transaction was approved`,
        life: 4000});
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

//Decline withdrawal
const decline = async () => {
  try {

    loading.value = true;
    const response = await  axios.post('/admin/transactions/withdrawals/decline',
        {
          id: record.value.id,
        },
        {
          headers: {'Authorization': `Bearer ${store.token}`}
        }

    )

    if (response.status === 200){
      declineDialog.value.close();
      record.value = null;
      return toast.add({severity:'success', summary: 'success',
        detail: `Transaction was declined`,
        life: 4000});
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



//open Approval dialog
const openApproveDialog = () => {
  approveDialog.value.showModal();
}

//Open Decline Dialog
const openDeclineDialog = () => {
  declineDialog.value.showModal();
}


</script>


<template>
<div class="container my-4">
  <div class="row justify-content-center">
    <h3 class="text-center mb-3">Transaction Lookup</h3>
    <div class="col-md-6 col-lg-5">

        <form @submit.prevent="search">
          <div class="input-group">
            <input type="search" class="p-inputtext p-inputtext-sm shadow-none" v-model.trim="referenceNumber"
                   placeholder="Reference No." required spellcheck="false" style="width: 85%;">
            <button type="submit" class="p-button p-button-sm " :disabled="loading">
              <span :class="loading ? 'spinner-border spinner-border-sm' : 'pi pi-search'"></span>
            </button>
          </div>
        </form>

    </div>
  </div>

  <div class="center">
    <div class="" v-if="record">
      <div>Number: <span class="fw-bold">0{{ record.phone }}</span></div>
      <div>Name: <span class="fw-bold text-capitalize">{{ record.name.toLowerCase() }}</span></div>
      <div>Amount: <span class="fw-bold">{{ formatNumber(record.amount) }}</span></div>
      <div>Reference No.: <span class="fw-bold">{{ record.referenceNumber }}</span></div>
      <div>Type.: <span class="fw-bold text-capitalize">{{ record.transactionType }}</span></div>
      <div>Status: <span class="fw-bold text-capitalize">{{ record.status.toLowerCase() }}</span></div>
      <div>Network: <span class="fw-bold text-capitalize">{{ record.network }}</span></div>
      <div>Date: <span class="fw-bold text-capitalize">
         {{ moment(record.createdAt).format("YYYY-MM-DD")}}
         {{ moment(record.createdAt).format("h:mm:ss a") }}
             </span></div>

      <template v-if="record.status === 'pending'">
        <br>
        <div class="">
          <button class="btn btn-danger btn-sm mb-2" @click="openDeclineDialog" :disabled="loading">
            Decline
          </button>
          <button class="btn btn-success btn-sm mb-2 float-end" @click="openApproveDialog" :disabled="loading">
            Approve
          </button>
        </div>
      </template>
    </div>

    <div class="center" v-if="recordNotFound">
      <h1 class="text-danger">Record Not Found</h1>
    </div>

  </div>




  <!-- Approve Dialog-->
  <dialog ref="approveDialog" class="border-0 px-5 py-3 w-50">
    <div class="mb-4">
      <button class="bg-danger text-white float-end btn" title="Close"
              @click="approveDialog.close()">x</button>
    </div>
    <br>
    <h6 class="text-center mb-4">Do you want to approve this transaction?</h6>

    <div class="text-center">
      <button class="btn btn-success btn-sm mb-2" @click="approve" :disabled="loading">
        <span class="spinner-border spinner-border-sm" v-if="loading"></span>&nbsp;
        Yes
      </button>
      <br>
    </div>
  </dialog>


  <!-- Decline Dialog-->
  <dialog ref="declineDialog" class="border-0 px-5 py-3 w-50">
    <div class="mb-4">
      <button class="bg-danger text-white float-end btn" title="Close"
              @click="declineDialog.close()">x</button>
    </div>
    <br>
    <h6 class="text-center mb-4">Do you want to decline this transaction?</h6>
    <div class="text-center">
      <button class="btn btn-danger btn-sm mb-2" @click="decline" :disabled="loading">
        <span class="spinner-border spinner-border-sm" v-if="loading"></span>&nbsp;
        Yes
      </button>
      <br>
    </div>
  </dialog>


</div>


</template>


<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
</style>