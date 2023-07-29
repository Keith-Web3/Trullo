import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import HomeLayout, {
  loader as HomeLayoutLoader,
} from './components/layouts/HomeLayout'
import HomePage from './components/pages/HomePage'
import Board from './components/pages/Board/Board'
import Login, {
  authAction as loginAction,
} from './components/features/auth/Login'
import SignUp, { authAction } from './components/features/auth/SignUp'
import ForgotPassword from './components/features/auth/ForgotPassword'

const App = function () {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="update-password" element={<ForgotPassword />} />
        <Route path="login" action={loginAction} element={<Login />} />
        <Route path="signup" action={authAction} element={<SignUp />} />
        <Route loader={HomeLayoutLoader} element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="board/:boardId" element={<Board />} />
        </Route>
      </Route>
    )
  )
  return <RouterProvider router={router} />
}

export default App
