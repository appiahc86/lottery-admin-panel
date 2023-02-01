import Login from "../../../src/views/users/Login.vue";
import Profile from "../../../src/views/users/Profile.vue";

const userRouter = [
    {
        path: '/users/login',
        name: 'login',
        component: Login
    },
    {
        path: '/users/profile',
        name: 'profile',
        component: Profile
    },
]

export default userRouter;