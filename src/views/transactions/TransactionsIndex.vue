<script setup>
import { ref } from "vue";
import axios from "../../axios.js";
import { formatNumber } from "@/functions";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useHomeStore } from "@/store/home";
const store = useHomeStore();

const loading = ref(null);
const transactions = ref([]);
const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);


//Get all transactions
const getTransactions = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/transactions',
        {
          params: {
            page: page.value,
            pageSize: pageSize.value,
          },
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      transactions.value = response.data.data;
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

getTransactions();

const onPage = (event) => {
  page.value = event.page + 1;
  getTransactions();
};

</script>

<template>
<div class="container-fluid">
  <h2 class="text-center mt-4">Transactions</h2>
  <div class="row">
    <div class="col">

      <div class="table-responsive mt-2">
        <!--        Table -->
        <DataTable :value="transactions" :lazy="true" :paginator="true" :rows="pageSize" dataKey="id"
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
          <Column field="createdAt" header="Date" :sortable="true" class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ new Date(data.createdAt).toLocaleDateString() }} {{ new Date(data.createdAt).toLocaleTimeString() }}
              </td>
            </template>
          </Column>
          <Column field="amount" header="Amount" :sortable="true" class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ formatNumber(data.amount) }}
              </td>
            </template>
          </Column>
          <Column field="referenceNumber" header="Reference No." :sortable="true" class="data-table-font-size"></Column>
          <Column field="transactionType" header="Type" :sortable="true" class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ data.transactionType }}
              </td>
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true" class="data-table-font-size">
            <template #body="{data}">
              <td class="text-capitalize">
              <td class="text-capitalize">
                <span class="badge bg-secondary" style="font-size: 0.9em" v-if="data.status === 'pending'">{{ data.status }}</span>
                <span class="badge bg-success" style="font-size: 0.9em" v-if="data.status === 'successful'">{{ data.status }}</span>
                <span class="badge bg-danger" style="font-size: 0.9em" v-if="data.status === 'failed'">{{ data.status }}</span>
              </td>
              </td>
            </template>
          </Column>
        </DataTable>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>

</style>