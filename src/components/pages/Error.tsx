import { Link } from 'react-router-dom'

import '../../sass/pages/error.scss'

const Error = function () {
  return (
    <div className="error">
      <div className="error__container">
        <img className="error__image" src="/server.svg" alt="server" />
        <div className="error__main">
          <h1>Something went wrong</h1>
          <p>
            Your request couldn't be processed by the server. Try refreshing the
            page, if the issue persists, leave a complaint on{' '}
            <a href="https://github.com/Keith-Web3/Trullo---Trello-Clone/issues/new">
              our repo.
            </a>
          </p>
          <Link to="/">
            <button>Take me home</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error
