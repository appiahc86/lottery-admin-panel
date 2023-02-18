import EnterDrawNumbers from "../../views/draw/EnterDrawNumbers.vue";
import DrawIndex from "../../views/draw/DrawIndex.vue";
import EditDraw from "../../views/draw/EditDraw.vue";

const drawRouter = [
    { //List draw numbers
        path: '/draw',
        name: 'draw',
        component: DrawIndex,
        meta: {requiresAuth: true}
    },
    {
        //Enter draw numbers
        path: '/draw/numbers',
        name: 'draw-numbers',
        component: EnterDrawNumbers,
        meta: {requiresAuth: true}
    },
    {
        path: '/draw/:id/:draw/:machine/:date',
        name: 'edit-draw',
        component: EditDraw,
        meta: {requiresAuth: true}
    },
]

export default drawRouter;