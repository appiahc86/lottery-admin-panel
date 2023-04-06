<script setup>
import { computed, ref} from "vue";
import axios from "@/axios";
import { useHomeStore } from "@/store/home";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import { formatNumber } from "@/functions";
import moment from "moment";

const store = useHomeStore();
const loading = ref(false);
const date = ref(null);
const selectedDate = ref(null);
const tickets = ref([]);


//Search transaction
const search = async () => {
  try {
    if (!date.value) return toast.add({severity:'warn', detail: `Please select date`, life: 2000});
    loading.value = true
    selectedDate.value = null;

    const searchDate = moment(date.value).format("YYYY-MM-DD")

    const response = await  axios.post('/admin/tickets/search-tickets',
        JSON.stringify({date: searchDate }),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      tickets.value = response.data;
      if (tickets.value.length) tickets.value.map((item, index) => item.count = index + 1);
      selectedDate.value = moment(date.value).format('ll');
      date.value = null;
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
  <div class="container mt-2 mb-3">
    <div class="row justify-content-center">
      <h5 class="text-center mb-3">Search Tickets By Date</h5>
      <div class="col-md-6 col-lg-5">

        <form @submit.prevent="search">
          <div class="input-group">
            <Calendar v-model="date" touchUI dateFormat="M-dd-yy" :manualInput="false"/>

            <button type="submit" class="p-button p-button-sm " :disabled="loading">
              <span :class="loading ? 'spinner-border spinner-border-sm' : 'pi pi-search'"></span>
            </button>
          </div>
        </form>

      </div>
    </div>

    <div class="row">
      <div class="col">

        <h6 class="mt-2">{{ selectedDate }}</h6>
        <div class="table-responsive mt-3 mb-5">
          <!--        Table -->
          <DataTable :value="tickets" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll" :rowsPerPageOptions="[10,25, 50]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

            <template #loading>
              <h6 class="text-white fw-bold">Loading data Please wait. <span class="spinner-border spinner-border-sm"></span></h6>
            </template>



            <Column header="#" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                {{ data.count.toLocaleString() }}
              </template>
            </Column>
            <Column field="user" header="User" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  0{{ data.user }}
                </td>
              </template>
            </Column>
            <Column field="numbers" header="Numbers" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
               <td>{{ JSON.parse(data.numbers).toString() }}</td>
              </template>
            </Column>
            <Column field="amount" header="Perm Amount" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ formatNumber(data.amount) }}
                </td>
              </template>
            </Column>
            <Column field="payable" header="Payable" :sortable="false" class="data-table-font-size">
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