import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  return (
    <div>
      {accessToken && 
      <h1>Welcome to Admin Page and you are logged in</h1>
      }
      {!accessToken && (
        <div>
          <h1>Welcome to Home Page</h1>
      <Link to="/login">
        <button>Do you want to log in?</button>
      </Link>
      <Link to="/signup">
        <button>Wanna sign up</button>
      </Link>
      </div>
      )}
    </div>
  )
}
 
export default Home