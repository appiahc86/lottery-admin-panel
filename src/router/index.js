import { createRouter, createWebHistory } from 'vue-router';
import {useHomeStore} from "@/store/home";

import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import clientUserRouter from  "./users/clients/index";
import  userRouter from "./users/index.js";
import imagesRouter from "./images/index.js";
import drawRouter from "./draw/index.js";
import transactionsRouter from "@/router/transactions";
import settingsRouter from "@/router/settings";
import ticketsRouter from "@/router/tickets";


const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {requiresAuth: true}
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {requiresAuth: true}
    },

    //Load imported routes
    ...userRouter,
    ...clientUserRouter,
    ...imagesRouter,
    ...drawRouter,
    ...transactionsRouter,
    ...settingsRouter,
    ...ticketsRouter,

//    redirect to home page if route not found
    {
        path: '/:catchAll(.*)*',
        redirect: {name: 'home'}
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 }
        }
    }

})


router.beforeEach((to, from) => {
    const store = useHomeStore();
    if (to.meta.requiresAuth && !store.token) {
        return {
            name: 'login',
            // save the location we were at to come back later
            query: { redirect: to.fullPath },
        }
    }
})


export default router;