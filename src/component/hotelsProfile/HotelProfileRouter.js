import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import HotelProfile_Main from "./auxiliary/HotelProfile_Main";
import './css/hotelProfile.css'
import EditHotelProfile from "./auxiliary/EditHotelProfile";
import HotelProfileNavigation from "./auxiliary/HotelProfileNavigation";
import HotelProfile_Rooms from "./auxiliary/hotelRooms/HotelProfile_Rooms";
import testHotelAdminProfile from '../../images/testHotel/testHotelAdminProfile.png'
import testHotelProfile from '../../images/testHotel/testHotelProfile.png'
import Loading from "../loading/Loading";
import { requestApi } from "../apiRequests/requestApi";
import ServerFetchError from "../errorMessage/ServerFetchError";
import HotelProfile_CreateRoom from "./auxiliary/hotelRooms/HotelProfile_CreateRoom";
import HotelProfile_Settings from "./auxiliary/HotelProfile_Settings";
import ALert1 from "../alerts/Alert1";
import HotelProfile_RoomReservations from "./auxiliary/hotelRooms/reservations/HotelProfile_RoomReservations";

export default function HotelProfileRouter({ navigateTo, user, setUser }){
    const pathname = useLocation().state
    const hotelRouterNavigation = useNavigate()
    const hotelRouterNavigateTo = (path) => hotelRouterNavigation(path)

    const accessToken = useRef(localStorage.getItem('accessToken')).current

    const [user_HP, setUser_HP] = useState({...user, alertModal: null, newRoute_HP: null, newRoute: null, noUser: false})
    const [alertModal, setAlertModal] = useState()  

    useEffect(() => {
        if(!user){
            const hotel_id = localStorage.getItem('hotel_id')
            fetchHotel({ hotel_id })
        }
    }, [])

    useEffect(() => {
        if(user_HP){            
            const { newRoute_HP, alertModal, noUser } = user_HP
            if(newRoute_HP){
                hotelRouterNavigateTo(newRoute_HP)
            }

            if(alertModal){
                setAlertModal(alertModal)
            }

            if(!noUser){
                setUser({...user_HP, alertModal: null, usertype: 'hotel'})
            }
        }
    }, [user_HP])

    const logout = () => {
        localStorage.clear()
        setAlertModal({message: 'logging you out...', callback: clearUser})
    }

    const clearUser = () => setUser_HP({noUser: true})

    const fetchHotel = async ({ hotel_id }) => {
        const url = `users/hotels/single-hotel/${hotel_id}`
        const fetchedHotel = await requestApi({ token: accessToken, url, method: 'get' })
        const { responseStatus, result, errorMsg } = fetchedHotel
        if(responseStatus){
            const { data } = result 
            if(data){
                setUser_HP({ details: { ...data, usertype: 'hotel' } })
            } else{
                setUser_HP({noUser: true})
            }
        } else{
            setUser_HP({noUser: true})
            // _setStatus({ isLoading: false, errorMsg: errorMsg.error })
        }
    }

    if(user_HP){
        const { details, noUser } = user_HP
        if(details){
            const { coverimg } = details
        
            return (
                <div>
                    <div className="mb-4 pb-3">
                        <div 
                            style={{ backgroundImage: `url(${coverimg})` }} className='hotel-profile-main-cover-img' 
                        />
                    </div> 
                    <div className="d-flex">
                        <div className="col-lg-1 d-flex justify-content-center">
                            <HotelProfileNavigation 
                                logout={logout} 
                                navigateTo={navigateTo}
                                hotelRouterNavigateTo={hotelRouterNavigateTo} 
                            />
                        </div>
                        <div className="col-lg-11">
                            <Routes>


                                <Route path="/" element={
                                    <HotelProfile_Main 
                                        accessToken={accessToken} 
                                        user_HP={user_HP} 
                                        hotelRouterNavigateTo={hotelRouterNavigateTo} 
                                        setUser_HP={setUser_HP}
                                    />
                                } />
        
                                <Route path="/edit-profile" element={
                                    <EditHotelProfile 
                                        user_HP={user_HP} 
                                        accessToken={accessToken} 
                                        setUser_HP={setUser_HP} />
                                } />
        
                                <Route path="/edit-hotel-rooms" element={
                                    <HotelProfile_Rooms 
                                        user_HP={user_HP} 
                                        hotelRouterNavigateTo={hotelRouterNavigateTo} 
                                        accessToken={accessToken}
                                        setUser_HP={setUser_HP}
                                    />
                                } />

                                <Route path="/create-hotel-room" element={
                                    <HotelProfile_CreateRoom 
                                        user_HP={user_HP} 
                                        accessToken={accessToken}
                                        setUser_HP={setUser_HP}
                                        specificRoom={{}}
                                        hotelRouterNavigateTo={hotelRouterNavigateTo}   />
                                } />                            

                                <Route path="/hotel-settings" element={
                                    <HotelProfile_Settings
                                        user_HP={user_HP} 
                                        accessToken={accessToken}
                                        setUser_HP={setUser_HP}
                                        hotelRouterNavigateTo={hotelRouterNavigateTo}  />
                                } /> 

                                <Route path='/room-reservations/:room_id' element={
                                    <HotelProfile_RoomReservations 
                                        user_HP={user_HP}
                                        setUser_HP={setUser_HP}
                                        hotelRouterNavigateTo={hotelRouterNavigateTo}
                                        accessToken={accessToken}
                                    />
                                } />


                            </Routes>  
                        </div>        
                    </div>
                    <ALert1 customAlert={alertModal} />    
                </div>
            )
        } else{
            const logoutCallBack = () => setUser_HP(prev => ({
                ...prev,
                details: null,
                newRoute: '/',
                noUser: false 
            }))

            return <ALert1 customAlert={{
                message: 'you have been logged out',
                callback: logoutCallBack,
                duration: 1000
            }} />        
        }
    }

    return <Loading loadingText={'loading profile'} />
}