import CurrentTickets from "@/views/tickets/CurrentTickets";
import TomorrowTickets from "@/views/tickets/TomorrowTickets";
import SearchDailyTickets from "@/views/tickets/SearchDailyTickets";
import WinningsView from "@/views/winnings/WinningsView";

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
    {
        path: '/search-tickets',
        name: 'search-tickets',
        component: SearchDailyTickets,
        meta: {requiresAuth: true}
    },
    {
        path: '/winners',
        name: 'winners',
        component: WinningsView,
        meta: {requiresAuth: true}
    },


]

export default ticketsRouter;