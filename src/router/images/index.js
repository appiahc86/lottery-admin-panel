import ImagesIndex from "@/views/images/ImagesIndex";
import UploadImage from "@/views/images/UploadImage";

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