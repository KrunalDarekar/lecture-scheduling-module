import { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminSignIn from './pages/AdminSignIn'
import InstructorSignIn from './pages/InstructorSignIn'
import { Toaster } from './components/ui/toaster'
import Landing from './pages/Landing'
import AdminDash from './pages/AdminDash'
import InstructorDash from './pages/InstructorDash'
import axios from 'axios'
import { base_url } from './config'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isSignedInAtom, userAtom } from './state/atoms'
import Course from './pages/Course'
import CreateCourse from './pages/CreateCourse'

function App() {

  const token = localStorage.getItem('token')
  const isSignedIn =  useRecoilValue(isSignedInAtom)
  const setIsSignedIn = useSetRecoilState(isSignedInAtom)
  const setUser = useSetRecoilState(userAtom)

  useEffect( () => {
    if(token && !isSignedIn) {
      axios.get(`${base_url}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then( res => {
        setUser(res.data)
        setIsSignedIn(true)
      })
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Toaster/>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path='/signin' >
            <Route path='/signin/admin' element={<AdminSignIn/>}></Route>
            <Route path='/signin/instructor' element={<InstructorSignIn/>}></Route>
          </Route>
          <Route path='/admin' element={<AdminDash/>}></Route>
          <Route path='/instructor' element={<InstructorDash/>}></Route>
          <Route path='/course/:id' element={<Course/>}></Route>
          <Route path='/create' element={<CreateCourse/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
