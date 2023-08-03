import React, { useEffect, useRef, useState } from "react";
import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import RouterScrollToTop from "./component/scroll/RouterScrollToTop";
import SignUp from "./component/auth/SignUp";
import HotelProfileRouter from "./component/hotelsProfile/HotelProfileRouter";
import Apptrying from './component/pageone/homecompiler/homecompiler'
import Login from "./component/auth/Login";
import RegisterProfile from "./component/auth/RegisterProfile";
import ALert1 from "./component/alerts/Alert1";
import { requestApi } from "./component/apiRequests/requestApi";
import Loading from "./component/loading/Loading";
import Nav from "./component/pageone/nav/nav";
import SingleHotel from "./component/singleHotel/SingleHotel";
import Footer from "./component/pageone/footer/footer";
import UserRouter from "./component/userProfile/UserRouter";

const Routers = () => {
  const location = useLocation()
  const initiateNavigation = useNavigate()
  const navigateTo = (path, data) => initiateNavigation(path, { state: data })

  const accessToken = useRef(localStorage.getItem('accessToken')).current
  const usertype = useRef(localStorage.getItem('usertype')).current
  const id = useRef(localStorage.getItem('id')).current

  const [user, setUser] = useState()
  const [allHotels, setAllHotels] = useState({ data: null, isLoading: true, errorMsg: null })
  const [activeHotel, setActiveHotel] = useState({ roomIdSelected: null, hotelDetails: null })
  const [alertModal, setAlertModal] = useState()

  useEffect(() => {
    if(!user){
        fetchUser()
    }
    fetchHotels()
  }, [])

  useEffect(() => {
    if(user){
      const { details, newRoute, alertModal } = user
      if(newRoute){
        navigateTo(newRoute, { details })
      }

      if(alertModal){
        setAlertModal(alertModal)
      }
    }
  }, [user])

  useEffect(() => {
    if(activeHotel){
      const { alertModal, newRoute } = activeHotel
      if(newRoute){
        navigateTo(newRoute)
      }

      if(alertModal){
        setAlertModal(alertModal)
      }
    }
  }, [activeHotel])

  const fetchHotels = async () => {
    const hotels = await requestApi({ url: 'users/hotels/all-hotels', method: 'get' })
    const { responseStatus, result, errorMsg } = hotels
    if(responseStatus){
      const { data } = result
      setAllHotels({ isLoading: false, data, errorMsg: null})
    } else{
      setAllHotels({ isLoading: false, data: null, errorMsg: errorMsg.error})
    }
  }

  const fetchUser = async () => {
    if(id && usertype && accessToken){
      const url = 
        usertype 
        ? 
          usertype == 'hotel' 
            ? 
              `users/hotels/single-hotel/${id}` 
            : 
              `users/customers/single-customer/${id}` 
        : 
          ''
      const fetchedUser = await requestApi({ token: accessToken, url, method: 'get' })
      const { responseStatus, result, errorMsg } = fetchedUser
      if(responseStatus){
          const { data } = result 
          setUser({ details: data, alertModal: null })
      } else{
        setUser({details: null, alertModal: null})
      }
    } else{
      setUser({details: null, alertModal: null})
    }

    return;
}  

  return (
    <>
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={500}            
        >
          <div>          
            {
              user
              ?
                <div>                  
                  <RouterScrollToTop />                   
                  <Routes location={location}>
                    <Route path="/" element={
                      // user.errorMsg
                      // ?
                      //   <Login navigateTo={navigateTo} setUser={setUser} />
                      // :
                        <Apptrying 
                          navigateTo={navigateTo} 
                          user={user}
                          setUser={setUser}
                          allHotels={allHotels}
                          setActiveHotel={setActiveHotel}
                        />
                    } />

                    <Route path="/sign-up" element={<SignUp navigateTo={navigateTo} />} />

                    <Route path="/login" element={<Login navigateTo={navigateTo} setUser={setUser} />} />

                    <Route path="/register-hotel-profile" element={<RegisterProfile navigateTo={navigateTo} setUser={setUser} />} />
                    
                    <Route path="/register-customer-profile" element={<RegisterProfile navigateTo={navigateTo} setUser={setUser} />} />

                    <Route path="/hotel/profile/*" element={<HotelProfileRouter navigateTo={navigateTo} user={user} setUser={setUser} />} />

                    <Route path="/user/profile/*" element={
                      <UserRouter 
                        navigateTo={navigateTo} 
                        user={user} 
                        setUser={setUser}
                        allHotels={allHotels.data ? allHotels.data : []}
                      />
                    } />


                    <Route 
                      path="/hotels/single-hotel/:active_hotel_id"  
                      element={
                        <SingleHotel
                          activeHotel={activeHotel}
                          user={user}
                          setUser={setUser}
                          navigateTo={navigateTo}
                          allHotels={allHotels}
                          accessToken={accessToken}
                          setActiveHotel={setActiveHotel}
                        />
                      }
                    />
                    <Route path="*" element={<h1>Not found!</h1>} />
                  </Routes>          

                  <ALert1 customAlert={alertModal} setAlertModal={setAlertModal} />                  
                </div>                    
              :
                <Loading loadingText={'fetching your profile'} />
            }
          </div>
        </CSSTransition>
      </TransitionGroup>   
    </> 
  )
}

function App() {

  return (
      <div className="App">
        <HashRouter>  
          <Routers />     
        </HashRouter>
      </div>
  );
}

export default App;