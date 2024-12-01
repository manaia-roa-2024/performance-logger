/* eslint-disable react/jsx-key */
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import App from './components/App'
import AuthenticationPage from './components/AuthenticationPage'
import LoginPage from './components/LoginPage'

const router = createBrowserRouter(
  createRoutesFromElements([
  <Route>
    <Route path='login' element={<AuthenticationPage requireAuth={false} redirectPath='/'/>}>
      <Route path='' element={<LoginPage/>}/>
    </Route>
    <Route path='' element={<AuthenticationPage requireAuth={true} redirectPath='/login'/>}>
      <Route index element={<App/>}/>
    </Route>
  </Route>
])
)

export default router
