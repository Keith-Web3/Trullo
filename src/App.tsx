import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import HomeLayout from './components/layouts/HomeLayout'
import HomePage from './components/pages/HomePage'
import Board from './components/pages/Board/Board'

const App = function () {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="board/:boardId" element={<Board />} />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}

export default App
