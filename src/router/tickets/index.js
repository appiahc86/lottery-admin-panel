import CurrentTickets from "@/views/tickets/CurrentTickets"

const ticketsRouter = [
    {
        path: '/current-tickets',
        name: 'current-tickets',
        component: CurrentTickets,
        meta: {requiresAuth: true}
    },

]

export default ticketsRouter;