import TransactionsIndex from "../../views/transactions/TransactionsIndex.vue";

const transactionsRouter = [
    {
        path: '/transactions',
        name: 'transactions',
        component: TransactionsIndex,
        meta: {requiresAuth: true}
    },
]

export default transactionsRouter;