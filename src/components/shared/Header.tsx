import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Await, Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Button from '../ui/Button'
import '../../sass/shared/header.scss'
import Loader from '../ui/Loader'
import { supabase } from '../data/supabase'

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
  const params = useParams()
  const { isLoading, data } = useQuery({
    queryKey: ['get-board-id', params.boardId],
    queryFn: async function () {
      const { data, error } = await supabase
        .from('Boards')
        .select('name')
        .eq('id', params.boardId)
      if (error) toast.error(error.message)
      return data
    },
  })

  return (
    <header className="header">
      <img className="header__logo" src="/Logo.svg" alt="logo" />
      {params.boardId !== undefined && (
        <div className="boards__info">
          {isLoading ? <Loader /> : data?.[0].name}
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
