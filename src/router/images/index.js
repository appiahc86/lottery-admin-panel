import ImagesIndex from "../../views/images/ImagesIndex.vue";
import UploadImage from "../../views/images/UploadImage.vue";
import ArrangeImages from "../../views/images/ArrangeImages.vue";

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
    {
        path: '/images/arrange',
        name: 'arrange-images',
        component: ArrangeImages,
        meta: {requiresAuth: true}
    },
]

export default imagesRouter;