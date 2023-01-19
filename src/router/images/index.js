import ImagesIndex from "../../views/images/ImagesIndex.vue";
import UploadImage from "../../views/images/UploadImage.vue";

const imagesRouter = [
    {
        path: '/images',
        name: 'images',
        component: ImagesIndex,
        meta: {requiresAuth: true}
    },
    {
        path: '/images/upload',
        name: 'upload-images',
        component: UploadImage,
        meta: {requiresAuth: true}
    },
]

export default imagesRouter;