<script setup>
import {onMounted, ref} from "vue";
import axios from "@/axios";
import Button from "primevue/button";
import { useHomeStore } from "@/store/home";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

let myDropzone;

onMounted(() => {

   myDropzone = new Dropzone("#my-form", {
      paramName: "images", // The name that will be used to transfer the file
      method: "post",
      parallelUploads: 5,
      uploadMultiple: true,
      headers:  { 'Authorization': `Bearer ${store.token}`},
      autoProcessQueue: false,
      acceptedFiles: "image/*",
      maxFilesize: 100000,

  });
})


const store = useHomeStore();

const loading = ref(false);

//Upload files
const upload =  async () => {

  try {
    const queuedFiles = myDropzone.getQueuedFiles();
    if (!queuedFiles.length) return  toast.add({severity:'warn', detail: "Please select images first", life: 4000});
    loading.value = true;
     myDropzone.processQueue();
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
  }finally { loading.value = false; }
}



</script>

<template>

  <h5 class="mt-3">Upload Images</h5>
<!--  <FileUpload name="images[]" :url="axios.defaults.baseURL + '/admin/uploads'" @upload="upload($event)"-->
<!--                @error="errorHandler($event)" :multiple="true" accept="image/*" :maxFileSize="200000"-->
<!--                @before-upload="beforeUpload($event)" :showUploadButton="showUploadBtn">-->
<!--    <template #content>-->
<!--      <ul v-if="uploadedFiles && uploadedFiles[0]">-->
<!--        <li v-for="file of uploadedFiles[0]" :key="file">{{ file.name }} - {{ file.size }} bytes</li>-->
<!--      </ul>-->
<!--    </template>-->
<!--    <template #empty>-->
<!--      <p>Images will be displayed here</p>-->
<!--    </template>-->

  <form :action="axios.defaults.baseURL+'/admin/uploads'" class="dropzone" id="my-form"></form>

  <div class="text-center">
    <Button label="Upload" type="button" :loading="loading" loadingIcon="spinner-border spinner-border-sm"
            class="p-button  p-button-rounded mt-3 mx-2" @click="upload" />
  </div>

</template>


<style scoped>

</style>