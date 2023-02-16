import TransactionsIndex from "../../views/transactions/TransactionsIndex.vue";
import SingleTransaction from "../../views/transactions/SingleTransaction.vue";

const transactionsRouter = [
    {
        path: '/transactions',
        name: 'transactions',
        component: TransactionsIndex,
        meta: {requiresAuth: true}
    },
    {
        path: '/transactions/single',
        name: 'single-transaction',
        component: SingleTransaction,
        meta: {requiresAuth: true}
    },
]

export default transactionsRouter;