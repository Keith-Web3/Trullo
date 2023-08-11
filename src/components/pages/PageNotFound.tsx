import { Link } from 'react-router-dom'

import Img from '../ui/Img'
import '../../sass/pages/page-not-found.scss'

const PageNotFound = function () {
  return (
    <div className="page-not-found">
      <div className="page-not-found__container">
        <header>
          <img className="logo" src="/Logo.svg" alt="logo" />
        </header>
        <section>
          <p className="oops">oops...</p>
          <p className="not-found">Page not found</p>
          <p className="not-found-message">
            This Page doesn`t exist or was removed! We suggest you back to home.
          </p>
          <Link to="/">
            <button>
              <img src="/arrow_white.svg" alt="back" />
              <span>Back to home</span>
            </button>
          </Link>
        </section>
        <Img
          className="error-image"
          src="/404.svg"
          blurhash="L6BNHT-;8wM{-?oe%gax00D%%jt8"
          alt="404"
        />
      </div>
    </div>
  )
}

export default PageNotFound
