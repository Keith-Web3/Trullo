// import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './sass/index.scss'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
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
  </>
)
