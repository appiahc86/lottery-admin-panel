<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from "../../axios.js";
import { useHomeStore } from "@/store/home";
const store = useHomeStore();

const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);

const loading = ref(false);

const drawNumbers = ref([]);
const confirmDrawDialog = ref();
const confirmDeleteDialog = ref();
const selectedDraw = ref(null);

//..............Load draw numbers ..................
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/draw/numbers',
        {
          params: {
            page: page.value,
            pageSize: pageSize.value,
          },
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      drawNumbers.value = response.data.data;
      totalRecords.value = response.data.totalRecords;
    }


  } catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: e.response.data, life: 4000});

    if (e.request && e.request.status === 0) {
      return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, Connection to Server refused. Please check your internet connection or try again later', life: 4000});
    }
    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later', life: 4000});

  } finally { loading.value = false; }

}

  getData();

//Pagination controls
const onPage = (event) => {
  page.value = event.page + 1;
  getData();
};

//Confirm Draw
const confirmDraw = (draw) => {
  selectedDraw.value = draw;
  confirmDrawDialog.value.showModal();
}

//Perform Draw
const performDraw = async () => {
  confirmDrawDialog.value.close();
  try {
    loading.value = true;
    const response = await  axios.post('/admin/draw/perform',
        {id: selectedDraw.value.id},
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      drawNumbers.value.map(draw => {
        if (draw.id.toString() === selectedDraw.value.id.toString()){
          draw.closed = true;
        }
      })
      return toast.add({severity:'success', summary: 'Success', detail: "Draw was successful", life: 4000});
    }
  }catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: e.response.data, life: 4000});

    if (e.request && e.request.status === 0) {
      return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, Connection to Server refused. Please check your internet connection or try again later', life: 4000});
    }
    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later', life: 4000});

  }finally { loading.value = false; }

}


//confirm delete
const confirmDelete = (draw) => {
  selectedDraw.value = draw;
  confirmDeleteDialog.value.showModal();
}

//Delete draw
const deleteDraw = async () => {
  confirmDeleteDialog.value.close();
  try {
    loading.value = true;
    const response = await  axios.post('/admin/draw/delete',
        {id: selectedDraw.value.id},
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      drawNumbers.value = drawNumbers.value.filter(draw => {
        return draw.id.toString() !== selectedDraw.value.id.toString();
      })
      return toast.add({severity:'success', summary: 'Success', detail: "Record Deleted successfully", life: 4000});
    }
  }catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: e.response.data, life: 4000});

    if (e.request && e.request.status === 0) {
      return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, Connection to Server refused. Please check your internet connection or try again later', life: 4000});
    }
    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later', life: 4000});

  }finally { loading.value = false; }

}
</script>

<template>
  <h4 class="text-center mt-3">Draw Numbers</h4>
  <div class="container">
    <div class="row">
      <div class="col">

        <div class="table-responsive mt-2">
          <!--        Table -->
          <DataTable :value="drawNumbers" :lazy="true" :paginator="true" :rows="pageSize" dataKey="id"
                     :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <Column field="id" header="Draw ID" ref="company" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ data.id}}
                </td>
              </template>
            </Column>
            <Column field="drawDate" header="Date" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ new Date(data.drawDate).toLocaleDateString() }}
                </td>
              </template>
            </Column>
            <Column field="numbers" header="Draw Numbers" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ JSON.parse(data.numbers).toString() }}
                </td>
              </template>
            </Column>
            <Column field="closed" header="Status" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ data.closed ? 'Closed' : 'Open' }}
                </td>
              </template>
            </Column>
            <Column field="" header="Draw" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td v-if="!data.closed">
                  <span @click="confirmDraw(data)" style="cursor: pointer; font-size: 1.2em;">&#9989;</span>
                </td>
                <td v-else>

                </td>
              </template>
            </Column>
            <Column field="" header="" :sortable="false" class="data-table-font-size">
              <template #body="{data}">
                <td v-if="!data.closed">
                  <span class="pi pi-trash text-danger" style="cursor: pointer;" @click="confirmDelete(data)"></span>
                </td>
              </template>
            </Column>
          </DataTable>
        </div>

        <!--      Confirm draw dialog    -->
        <dialog ref="confirmDrawDialog" style="border: none;" class="p-5">
          <p>This will perform the draw operation which cannot be reversed.</p>
          <h6 class="text-center my3">Are you sure you want to continue?</h6>
          <div class="text-center">
            <button class="btn btn-secondary btn-sm mx-3" @click="confirmDrawDialog.close()">Cancel</button>
            <button class="btn btn-danger btn-sm" @click="performDraw">Proceed</button>
          </div>
        </dialog>

        <!--      Confirm delete dialog    -->
        <dialog ref="confirmDeleteDialog" style="border: none;" class="p-5">
          <h6 class="text-center my3">Are you sure you want to delete this record?</h6>
          <div class="text-center">
            <button class="btn btn-secondary btn-sm mx-3" @click="confirmDeleteDialog.close()">Cancel</button>
            <button class="btn btn-danger btn-sm" @click="deleteDraw">Proceed</button>
          </div>
        </dialog>

      </div>
    </div>
  </div>

</template>


<style scoped>

</style>