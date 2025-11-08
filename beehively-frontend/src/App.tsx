import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ContentDetail from './pages/ContentDetail'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="content/:id" element={<ContentDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
