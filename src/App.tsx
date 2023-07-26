import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import HomeLayout from './components/layouts/HomeLayout'

const App = function () {
  const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<HomeLayout />} />)
  )
  return <RouterProvider router={router} />
}

export default App
