import { QueryClient, dehydrate, hydrate } from '@tanstack/react-query';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            keepPreviousData: true,
            refetchOnReconnect: false,
            retry(failureCount, error) {
                return error.response
                    && !([404, 408, 502, 503, 504].includes(error.response.status))
                    && (failureCount < 3)
            },
        },
    },
})


// /* A key for the local storage. */
// const dehydratedState = 'dehydratedState'


// /* Saving the state of the query client to local storage. */
// window.addEventListener('beforeunload', () => {
//     localStorage.setItem(dehydratedState,
//         JSON.stringify(dehydrate(queryClient, {
//             shouldDehydrateQuery(query) {
//                 return !isFinite(query.cacheTime)
//             },
//         }))
//     )
// })


// /* Hydrating the query client with the dehydrated state. */
// hydrate(
//     queryClient,
//     JSON.parse(localStorage.getItem(dehydratedState)),
//     {
//         defaultOptions: {
//             queries: {
//                 cacheTime: Infinity,
//             },
//         },
//     }
// )


export default queryClient;
