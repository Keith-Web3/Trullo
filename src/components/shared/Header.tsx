import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

import Button from '../ui/Button'
import '../../sass/shared/header.scss'

const Header = function () {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="header">
      <img className="header__logo" src="Logo.svg" alt="logo" />
      {location.pathname !== '/' && (
        <div className="boards__info">
          Devchallenges Board
          <div></div>
          <Link to="/">
            <Button tag>
              <img src="grid.svg" alt="apps" />
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
        <img className="user__image" src="user.jpg" alt="user" />
        <p className="user__name">olorunnishola olamilekan</p>
        {
          // TODO add title to view fullname
        }
        <motion.img
          animate={{ rotate: isDropDownOpen ? '180deg' : '0deg' }}
          onClick={() => setIsDropDownOpen(prev => !prev)}
          className="user__caret"
          src="caret-down-solid.svg"
          alt="drop down"
        />
      </div>
    </header>
  )
}

export default Header
