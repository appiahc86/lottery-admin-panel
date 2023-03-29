import CurrentTickets from "@/views/tickets/CurrentTickets";
import TomorrowTickets from "@/views/tickets/TomorrowTickets";

const ticketsRouter = [
    {
        path: '/current-tickets',
        name: 'current-tickets',
        component: CurrentTickets,
        meta: {requiresAuth: true}
    },
    {
        path: '/tomorrow-tickets',
        name: 'tomorrow-tickets',
        component: TomorrowTickets,
        meta: {requiresAuth: true}
    },

]

export default ticketsRouter;