<script setup>
import { ref } from "vue";
import FileUpload from "primevue/fileupload";
import axios from "../../axios.js";

const uploadedFiles = ref([]);
const showUploadBtn = ref(true);
// const totalSize = ref(0);
// const totalSizePercent = ref(0);

//Upload files
const upload =  async (event) => {
  showUploadBtn.value = true;
  return toast.add({
    severity: 'success', summary: 'Success', detail: 'Upload was successful',
    life: 4000
  });
}

//Before upload, hide upload button
const beforeUpload = (event) => {
  showUploadBtn.value = false;
}

//Error Handler
const errorHandler = async (event) => {

  showUploadBtn.value = true; //show upload button

  if (event.xhr.status === 0){ //If server is down
    return toast.add({
      severity: 'warn', summary: 'Error', detail: 'Sorry, request could not reach server',
      life: 4000
    });
  }

  if (event.xhr.status === 400){ //If server returns error
    return toast.add({
      severity: 'warn', summary: 'Error', detail: event.xhr.response,
      life: 4000
    });
  }

  console.log(event)
  return toast.add({ //default error action
    severity: 'warn', summary: 'Error', detail: 'Sorry, Error occurred',
    life: 4000
  });


}

</script>

<template>

  <h5 class="mt-3">Upload Images</h5>
      <FileUpload name="images[]" :url="axios.defaults.baseURL + '/admin/uploads'" @upload="upload($event)"
                @error="errorHandler($event)" :multiple="true" accept="image/*" :maxFileSize="200000"
                @before-upload="beforeUpload($event)" :showUploadButton="showUploadBtn">
    <template #content>
      <ul v-if="uploadedFiles && uploadedFiles[0]">
        <li v-for="file of uploadedFiles[0]" :key="file">{{ file.name }} - {{ file.size }} bytes</li>
      </ul>
    </template>
    <template #empty>
      <p>Images will be displayed here</p>
    </template>
  </FileUpload>
  <div class=""></div>

</template>


<style scoped>

</style>