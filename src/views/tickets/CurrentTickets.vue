<script setup>
import axios from "@/axios";
import moment from "moment";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {computed, ref} from "vue";
import {useHomeStore} from "@/store/home";
import {formatNumber} from "@/functions";

const store = useHomeStore();
const loading = ref(false);
const tickets = ref([]);

socket.on("current-tickets", (data) => {
 tickets.value.unshift(data);
})


//Get today's tickets
const getTickets = async () => {

  try {
    loading.value = true;

    const response = await  axios.get('/admin/tickets/current-tickets',
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      tickets.value = response.data;
    }


  }catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: e.response.data, life: 4000});

    if (e.request && e.request.status === 0) {
      return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, Connection to Server refused. Please check your internet connection or try again later', life: 4000});
    }
    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later', life: 4000});

  }finally { loading.value = false; }
}

getTickets();

//Calculate total
const total = computed(() => {
  let total = 0;
  if (tickets.value.length){
    for (const record of tickets.value) {
      total += parseFloat(record.payable) || 0;
    }
  }

  return total;
})

</script>

<template>
  <div class="container-fluid">
    <h2 class="text-center mt-4">Today's Tickets
      <span class="pi pi-sync" style="cursor: pointer;" title="Reload Data" @click="getTickets" v-if="!loading"></span>
      <span class="spinner-border spinner-border-sm" v-if="loading"></span>
    </h2>

    <div class="row">
      <div class="col">

        <div class="table-responsive mt-2 mb-5">
          <!--        Table -->
          <DataTable :value="tickets" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll" :rowsPerPageOptions="[10,25, 50]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

            <template #loading>
              <h6 class="text-white fw-bold">Loading data Please wait. <span class="spinner-border spinner-border-sm"></span></h6>
            </template>

            <Column field="user" header="User" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  0{{ data.user }}
                </td>
              </template>
            </Column>
            <Column field="numbers" header="Numbers" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ JSON.parse(data.numbers).toString() }}
                </td>
              </template>
            </Column>
            <Column field="amount" header="Amount" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ formatNumber(data.payable) }}
                </td>
              </template>
            </Column>
            <Column field="createdAt" header="Date" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ moment(data.createdAt).format('YYYY-MM-DD') }} {{ moment(data.createdAt).format('h:mm:ss a') }}
                </td>
              </template>
            </Column>
          </DataTable>
        </div>

        <h5 class="">Total: <b>GH¢ {{ formatNumber(total) }}</b></h5>

      </div>
    </div>
  </div>
</template>


<style scoped>

</style>