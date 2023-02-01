<script setup>
import PickList from 'primevue/picklist';
import {onMounted, ref} from "vue";
import Button from "primevue/button";
import axios from "../../axios.js";
import { useHomeStore } from "@/store/home";

const store = useHomeStore();

const deleteDialog = ref(null);
const viewImageDialog = ref(null);
const selectedImage = ref(null);
const loadingInProgress = ref(false);
const images = ref(null);
const imagePath = ref('');
const loadingDialog = ref(null);


//Get images
const getImages = async () => {
  try {
    loadingDialog.value.showModal();
    const response = await  axios.get('/admin/uploads',
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      images.value = [response.data.images, []];
      imagePath.value = response.data.path;
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
  }finally {  loadingDialog.value.close(); }
}


onMounted(() => {
  getImages();
})


//Arrange Images
const arrange = async () => {
  try {
    loadingInProgress.value = true;
    let arrangedImages = [];
    if (images.value[0].length){
      arrangedImages = images.value[1].concat(images.value[0])
    }else arrangedImages = images.value[1];

    const response = await  axios.post('/admin/uploads/arrange',
        {images: arrangedImages},
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      return  toast.add({severity:'success', summary: 'Success', detail: 'Operation was successful', life: 4000});
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
  }finally { loadingInProgress.value = false; }
}

//confirm Delete
const confirmDelete = (image) => {
  selectedImage.value = image;
  deleteDialog.value.showModal();
}

//Delete Image
const deleteImage = async () => {
  try {
    deleteDialog.value.close();
    loadingDialog.value.showModal();
    const response = await  axios.post('/admin/uploads/delete',
        {image: selectedImage.value},
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      images.value = [response.data.images, []];
      return toast.add({severity:'success', summary: 'Success', detail: 'Image Deleted', life: 4000});
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
  }finally {   loadingDialog.value.close(); }
}

//View Image
const viewImage = async (image) => {
  selectedImage.value = image;
  viewImageDialog.value.showModal();
}

</script>

<template>
<div class="mt-4">
<div class="container-fluid">
  <div class="row">
    <div class="col">
      <PickList v-model="images" listStyle="height:342px" dataKey="id">
        <template #sourceheader>
          Available
        </template>
        <template #targetheader>
          Selected
        </template>
        <template #item="slotProps">
          <div class="image-item d-flex">
            <div class="image-container">
              <img :src="imagePath + slotProps.item.name" alt="image" width="100" height="50"/>
            </div>
            <div class="" style="float: right;">
              <h6 class="mt-3">&nbsp;#{{slotProps.item.id + 1}}</h6>
            </div>
            <div class="justify-content-end">
              <button class="mt-2 ms-4 me-4 btn btn-danger btn-sm"
                      @click="confirmDelete(slotProps.item)" title="Delete">
                <span class="text-white fw-bold p-1">x</span>
              </button>
<!--              <button class="justify-content-end mt-2 btn btn-success btn-sm"-->
<!--                      @click="viewImage(slotProps.item)" title="View">-->
<!--                <span class="pi pi-eye"></span></button>-->
            </div>
          </div>
        </template>
      </PickList>
    </div>
<div class="text-center">
  <Button label="Save" type="submit" :loading="loadingInProgress" loadingIcon="spinner-border spinner-border-sm"
          class="p-button  p-button-rounded mt-3 mx-2" @click="arrange" v-if="images && images[1].length"/>
</div>
  </div>
</div>


<!-- Delete dialog -->
  <dialog ref="deleteDialog" style="border: none;" class="p-5">
    <h6 class="text-center my3">Are you sure you want to delete this image?</h6>
    <div class="text-center">
      <button class="btn btn-secondary btn-sm mx-3" @click="deleteDialog.close()">Cancel</button>
      <button class="btn btn-danger btn-sm" @click="deleteImage">Delete</button>
    </div>
  </dialog>

  <!-- View image dialog -->
  <dialog ref="viewImageDialog" style="border: none;">
    <div class="text-center">
      <button class="btn btn-danger btn-sm fw-bold" @click="viewImageDialog.close()">X</button>
    </div>
    <div class="text-center p-1">
      <img :src="selectedImage ? imagePath + selectedImage.name : ''"
           class="img-fluid w-100" alt="image" style="width: 300px !important; max-height: 100px !important;">
    </div>
  </dialog>


<!-- Loading Dialog -->
  <dialog ref="loadingDialog" class="bg-transparent" style="border: none;">
    <h4 class=""><span class="spinner-border"></span></h4>
  </dialog>
</div>
</template>

<style scoped>

</style>