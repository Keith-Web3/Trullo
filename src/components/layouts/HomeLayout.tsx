import { Outlet } from 'react-router-dom'

// import Header from '../shared/Header'

const HomeLayout = function () {
  return (
    <main>
      {/* <Header /> */}
      <Outlet />
    </main>
  )
}

export default HomeLayout
