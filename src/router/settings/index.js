import Settings from "@/views/settings/Settings.vue"

const settingsRouter = [
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {requiresAuth: true}
    },

]

export default settingsRouter;