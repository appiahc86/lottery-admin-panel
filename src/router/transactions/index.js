import SearchTransaction from "../../views/transactions/SearchTransaction.vue";
import WithdrawalsView from "@/views/transactions/WithdrawalsView.vue";
import DepositsView from "@/views/transactions/DepositsView.vue";
import ViewDeposits from "@/views/transactions/ViewDeposits.vue";
import ViewWithdrawals from "@/views/transactions/ViewWithdrawals.vue";

const transactionsRouter = [
    {
        path: '/transactions/deposit',
        name: 'deposits',
        component: DepositsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/transactions/withdrawals',
        name: 'withdrawals',
        component: WithdrawalsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/transactions/view-deposits',
        name: 'view-deposits',
        component: ViewDeposits,
        meta: {requiresAuth: true}
    },
    {
        path: '/transactions/view-withdrawals',
        name: 'view-withdrawals',
        component: ViewWithdrawals,
        meta: {requiresAuth: true}
    },
    {
        path: '/transactions/search',
        name: 'search-transaction',
        component: SearchTransaction,
        meta: {requiresAuth: true}
    }
]

export default transactionsRouter;