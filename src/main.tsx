import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './sass/index.scss'
import App from './App.tsx'
import { supabase } from './components/data/supabase.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: '8px' }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
        style: {
          fontSize: '16px',
          maxWidth: 'max-content',
          padding: '16px 24px',
          color: '#333333',
        },
      }}
    />
  </React.StrictMode>
)
;(async function () {
  const { data, error } = await supabase.rpc('update_many_another', {
    payload: [
      { id: 1, name: 'updated-project-1' },
      { id: 2, name: 'updated-project-2' },
    ],
  })
  console.log(data, error)
})()
