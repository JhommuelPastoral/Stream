import { Route, Routes, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'
export default function App() {

  const {isLoading, isError, authData} = useAuthUser(); 

  const isAuthenticated = Boolean(authData);
  const isOnboarded = authData?.isOnboarded;
  const {theme} = useThemeStore();
  if(isLoading){
    return <PageLoader/>
  }
  return (
    <>
      <div data-theme={theme} >
        <Routes>
          <Route path='/' element={ isAuthenticated && isOnboarded ? <Layout> <HomePage /> </Layout>   : <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />} />
          <Route path='/login' element={ !isAuthenticated ?  <LoginPage/> : <Navigate to={!isOnboarded ? '/onboarding' : '/'} /> } />
          <Route path='/signup' element={!isAuthenticated ? <SignUpPage/> : <Navigate to="/" />} />
          <Route path='/onboarding' element={isAuthenticated && !isOnboarded ? <OnBoardingPage /> : <Navigate to="/login"/>} />
          <Route path='/call/:id' element={ isAuthenticated && isOnboarded ? <CallPage /> :  <Navigate to="/login" />} />
          <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? <Layout> <ChatPage /> </Layout> :  <Navigate to="/login" />} />
          <Route path='/notification' element={isAuthenticated && isOnboarded ? <Layout> <NotificationPage /> </Layout>   :  <Navigate to="/login" />} />
        </Routes>
        <Toaster/>
      </div>
    </>
  )
}
