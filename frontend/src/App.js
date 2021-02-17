import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { user } from './reducers/user'
import { attendants } from './reducers/attendants'

import Home from './pages/Home'
import LogIn from './pages/Login'
import SignUp from './pages/SignUp'
import Registration from './pages/Registration'
import ConfirmationPage from './pages/ConfirmationPage'
import CheckinPage from './pages/CheckinPage'
import NewEvent from './pages/NewEvent'
import Attendants from './pages/Attendants'



const reducer = combineReducers({ 
  user: user.reducer, 
  attendants: attendants.reducer,
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
          <Route path="/newevent" exact component={NewEvent} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/checkin/:attendantId" exact component={CheckinPage} />
          <Route path="/confirmation/:attendantId" exact component={ConfirmationPage} />
          <Route pathe="/attendants" exact component={Attendants} />
        </Switch>
      </Router>
    </Provider>
  )
}
