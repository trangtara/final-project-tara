import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { user } from './reducers/user'
import Home from './pages/Home'
import LogIn from './pages/Login'
import SignUp from './pages/SignUp'
import Registration from './pages/Registration'
import { attendant } from './reducers/attendant'
import Checkin from './pages/Checkin'

const reducer = combineReducers({ 
  user: user.reducer, 
  attendant: attendant.reducer 
})

const store = configureStore({ reducer })

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/checkin/:attendantId" exact component={Checkin} />
        </Switch>
      </Router>
    </Provider>
  )
}
