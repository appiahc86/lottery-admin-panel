import TransactionsIndex from "../../views/transactions/TransactionsIndex.vue";
import SearchTransaction from "../../views/transactions/SearchTransaction.vue";
import WithdrawalsView from "@/views/transactions/WithdrawalsView.vue";
import DepositsView from "@/views/transactions/DepositsView.vue";

const transactionsRouter = [
    {
        path: '/transactions',
        name: 'transactions',
        component: TransactionsIndex,
        meta: {requiresAuth: true}
    },
    {
        path: '/transactions/search',
        name: 'search-transaction',
        component: SearchTransaction,
        meta: {requiresAuth: true}
    },
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
]

export default transactionsRouter;