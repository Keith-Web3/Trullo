import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import HomeLayout, {
  loader as HomeLayoutLoader,
} from './components/layouts/HomeLayout'
import HomePage from './components/pages/Homepage/HomePage'
import Board from './components/pages/Board/Board'
import Login, {
  authAction as loginAction,
} from './components/features/auth/Login'
import SignUp, {
  authAction as signUpAction,
} from './components/features/auth/SignUp'
import ForgotPassword from './components/features/auth/ForgotPassword'
import PageNotFound from './components/pages/PageNotFound'
import Error from './components/pages/Error'

const App = function () {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<Error />}>
        <Route path="login" action={loginAction} element={<Login />} />
        <Route path="signup" action={signUpAction} element={<SignUp />} />
        <Route loader={HomeLayoutLoader} element={<HomeLayout />}>
          <Route path="update-password" element={<ForgotPassword />} />
          <Route index element={<HomePage />} />
          <Route path="board/:boardId" element={<Board />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}

export default App
