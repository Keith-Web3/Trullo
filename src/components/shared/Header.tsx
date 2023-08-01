import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Await, Link, useLocation } from 'react-router-dom'

import Button from '../ui/Button'
import '../../sass/shared/header.scss'
import Loader from '../ui/Loader'

type ResolvedData = {
  name: string
  img: string | undefined
  id: string
}

const loaderRenderProp = function (resolvedData: ResolvedData) {
  return (
    <>
      <img
        className="user__image"
        src={resolvedData.img || '/user.svg'}
        alt="user"
      />
      <p className="user__name" title={resolvedData.name}>
        {resolvedData.name}
      </p>
    </>
  )
}
const Header = function ({ userDetails }: { userDetails: unknown }) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="header">
      <img className="header__logo" src="/Logo.svg" alt="logo" />
      {location.pathname !== '/' && (
        <div className="boards__info">
          {location.state.name}
          <div></div>
          <Link to="/">
            <Button tag>
              <img src="/grid.svg" alt="apps" />
              <span>All boards</span>
            </Button>
          </Link>
        </div>
      )}
      <label className="header__label" htmlFor="search">
        <input placeholder="Keyword..." type="text" id="search" />
        <Button>search</Button>
      </label>
      <div className="user">
        <Suspense fallback={<Loader />}>
          <Await resolve={userDetails}>{loaderRenderProp}</Await>
        </Suspense>
        <motion.img
          animate={{ rotate: isDropDownOpen ? '180deg' : '0deg' }}
          onClick={() => setIsDropDownOpen(prev => !prev)}
          className="user__caret"
          src="/caret-down-solid.svg"
          alt="drop down"
        />
      </div>
    </header>
  )
}

export default Header
