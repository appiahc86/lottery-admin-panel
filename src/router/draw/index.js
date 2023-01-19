import EnterDrawNumbers from "../../views/draw/EnterDrawNumbers.vue";
import DrawIndex from "../../views/draw/DrawIndex.vue";

const drawRouter = [
    {
        path: '/draw',
        name: 'draw',
        component: DrawIndex,
        meta: {requiresAuth: true}
    },
    {
        path: '/draw/numbers',
        name: 'draw-numbers',
        component: EnterDrawNumbers,
        meta: {requiresAuth: true}
    },
]

export default drawRouter;