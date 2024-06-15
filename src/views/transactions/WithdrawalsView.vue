<script setup>
import { ref } from "vue";
import axios from "../../axios.js";
import { formatNumber } from "@/functions";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useHomeStore } from "@/store/home";
const store = useHomeStore();
import moment from "moment";

const loading = ref(null);
const dialogLoading = ref(null);
const withdrawals = ref([]);
const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const approveDialog = ref(null);
const declineDialog = ref(null);

const selectedData = ref(null);


//Get all pending withdrawals
const getWithdrawals = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/transactions/withdrawals',
        {
          params: {
            page: page.value,
            pageSize: pageSize.value,
          },
          headers: {'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      withdrawals.value = response.data.data;
      totalRecords.value = response.data.totalRecords;
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

getWithdrawals();

const onPage = (event) => {
  page.value = event.page + 1;
  getWithdrawals();
};

//open Approval dialog
const openApproveDialog = (data) => {
  selectedData.value = null;
  selectedData.value = data;
  approveDialog.value.showModal();
}

//Open Decline Dialog
const openDeclineDialog = (data) => {
  selectedData.value = null;
  selectedData.value = data;
  declineDialog.value.showModal();
}



//Approve withdrawal
const approve = async () => {
  try {

    //Validation
    if (!selectedData?.value?.id){
      return toast.add({severity:'warn', summary: 'Error',
        detail: `Please reload the page and try again`,
        life: 4000});
    }
    dialogLoading.value = true;
    const response = await  axios.post('/admin/transactions/withdrawals/approve',
        {
            id: selectedData.value.id,
          },
        {
          headers: {'Authorization': `Bearer ${store.token}`}
        }

    )

    if (response.status === 200){
      withdrawals.value = withdrawals.value.filter(w =>
      {return w.id.toString() !== selectedData.value.id.toString()}
      )
      approveDialog.value.close();
      selectedData.value = null;
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
  }finally { dialogLoading.value = false; }

}

//Decline withdrawal
const decline = async () => {
  try {

    //Validation
    if (!selectedData?.value?.id){
      return toast.add({severity:'warn', summary: 'Error',
        detail: `Please reload the page and try again`,
        life: 4000});
    }
    dialogLoading.value = true;
    const response = await  axios.post('/admin/transactions/withdrawals/decline',
        {
          id: selectedData.value.id,
        },
        {
          headers: {'Authorization': `Bearer ${store.token}`}
        }

    )

    if (response.status === 200){
      withdrawals.value = withdrawals.value.filter(w =>
          {return w.id.toString() !== selectedData.value.id.toString()}
      )
      declineDialog.value.close();
      selectedData.value = null;
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
  }finally { dialogLoading.value = false; }

}



</script>

<template>
  <div class="container-fluid">
    <h2 class="text-center mt-4">Pending Withdrawals</h2>
    <div class="row">
      <div class="col">

        <div class="table-responsive mt-2 mb-4">
          <!--        Table -->
          <DataTable :value="withdrawals" :lazy="true" :paginator="true" :rows="pageSize" dataKey="id"
                     :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <template #loading>
              <h6 class="text-white fw-bold">Loading data Please wait. <span class="spinner-border spinner-border-sm"></span></h6>
            </template>
            <Column field="phone" header="Phone" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ '0' + data.phone}}
                </td>
              </template>
            </Column>
            <Column field="name" header="Name" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td class="text-capitalize">
                  {{data?.name.toLowerCase()}}
                </td>
              </template>
            </Column>
            <Column field="network" header="Network" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td class="text-uppercase">
                  {{data.network}}
                </td>
              </template>
            </Column>
            <Column field="amount" header="Amount" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td class="fw-bold">
                  {{ formatNumber(data.amount) }}
                </td>
              </template>
            </Column>
            <Column field="createdAt" header="Date" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ moment(data.createdAt).format("YYYY-MM-DD")}} {{ moment(data.createdAt).format("h:mm:ss a") }}
                </td>
              </template>
            </Column>

            <Column field="referenceNumber" header="Reference No." :sortable="true" class="data-table-font-size"></Column>

<!--            <Column field="status" header="Status" :sortable="true" class="data-table-font-size">-->
<!--              <template #body="{data}">-->
<!--                <td class="text-capitalize">-->
<!--                  <span class="badge bg-secondary" style="font-size: 0.9em" v-if="data.status === 'pending'">{{ data.status }}</span>-->
<!--                  <span class="badge bg-success" style="font-size: 0.9em" v-if="data.status === 'successful'">{{ data.status }}</span>-->
<!--                  <span class="badge bg-danger" style="font-size: 0.9em" v-if="data.status === 'failed'">{{ data.status }}</span>-->
<!--                </td>-->
<!--              </template>-->
<!--            </Column>-->
            <Column field="" header="Approve" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  <button class="bg-success btn btn-sm text-white" @click="openApproveDialog(data)">
                    <span class="pi pi-check"></span></button>
                </td>
              </template>
            </Column>
            <Column field="" header="Decline" :sortable="true" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  <button class="bg-danger btn btn-sm text-white" @click="openDeclineDialog(data)">
                    <span class="pi pi-times"></span></button>
                </td>
              </template>
            </Column>
          </DataTable>
        </div>

      </div>
    </div>

<!-- Approve Dialog-->
    <dialog ref="approveDialog" class="border-0 p-5 w-50">
      <h6 class="text-center my3">Do you want to approve this transaction?</h6>
      <template v-if="selectedData">

            <div class="col-lg-9">
              <div>Number: <span class="fw-bold">0{{ selectedData.phone }}</span></div>
              <div>Name: <span class="fw-bold">{{ selectedData.name }}</span></div>
              <div>Amount: <span class="fw-bold">{{ formatNumber(selectedData.amount)}}</span></div>
              <div>Network: <span class="fw-bold text-capitalize">{{ selectedData.network }}</span></div>
              <div>Date: <span class="fw-bold text-capitalize">
             {{ moment(selectedData.createdAt).format("YYYY-MM-DD")}} {{ moment(selectedData.createdAt).format("h:mm:ss a") }}
             </span></div>
            </div>

      </template>

      <div class="text-center">
        <button class="btn btn-secondary btn-sm mx-3 mb-2" @click="approveDialog.close()">Cancel</button>
        <button class="btn btn-success btn-sm mb-2" @click="approve" :disabled="dialogLoading">
          <span class="spinner-border spinner-border-sm" v-if="dialogLoading"></span>&nbsp;
          Approve
        </button>
      </div>
    </dialog>


    <!-- Decline Dialog-->
    <dialog ref="declineDialog" class="border-0 p-5 w-50">
      <h6 class="text-center my3">Do you want to decline this transaction?</h6>
      <template v-if="selectedData">

        <div class="col-lg-9">
          <div>Number: <span class="fw-bold">0{{ selectedData.phone }}</span></div>
          <div>Name: <span class="fw-bold">{{ selectedData.name }}</span></div>
          <div>Amount: <span class="fw-bold">{{ formatNumber(selectedData.amount)}}</span></div>
          <div>Network: <span class="fw-bold text-capitalize">{{ selectedData.network }}</span></div>
          <div>Date: <span class="fw-bold text-capitalize">
             {{ moment(selectedData.createdAt).format("YYYY-MM-DD")}} {{ moment(selectedData.createdAt).format("h:mm:ss a") }}
             </span></div>
        </div>

      </template>

      <div class="text-center">
        <button class="btn btn-secondary btn-sm mx-3 mb-2" @click="declineDialog.close()">Cancel</button>
        <button class="btn btn-danger btn-sm mb-2" @click="decline" :disabled="dialogLoading">
          <span class="spinner-border spinner-border-sm" v-if="dialogLoading"></span>&nbsp;
          Decline
        </button>
      </div>
    </dialog>

  </div>
</template>

<style scoped>

</style>