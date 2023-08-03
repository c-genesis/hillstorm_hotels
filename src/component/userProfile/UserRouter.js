import React, { useEffect, useRef, useState } from 'react'
import { Routes, useNavigate, Route } from 'react-router-dom'
import Usersetting from './usersettings/usersetting'
import Usernavigation from './usernavigation/usernavigation'
import Settingproperties from './settingproperties/settingproperties'
import ALert1 from '../alerts/Alert1'
import Loading from '../loading/Loading'
import { requestApi } from '../apiRequests/requestApi'
import MyReservations from './roomreservations/MyReservations'
import './css/userProfile.css'
import Reservations from './roomreservations/Reservations'




export default function UserRouter({ user, setUser, navigateTo, allHotels }){

    const accessToken = useRef(localStorage.getItem('accessToken')).current
    const customer_id = useRef(localStorage.getItem('hotel_id')).current

    const navigation = useNavigate()
    const userRouterNavigateTo = (path, data) => navigation(path)

    const [user_CP, setUser_CP] = useState({...user, noUser: false, alertModal: null, newRoute_CP: null, newRoute: null})
    const [alertModal, setAlertModal] = useState()        

    useEffect(() => {
        if(!user){
            fetchCustomer()
        }
    }, [])

    useEffect(() => {
        if(user_CP){            
            const { newRoute_HP, alertModal, noUser } = user_CP
            if(newRoute_HP){
                userRouterNavigateTo(newRoute_HP)
            }

            if(alertModal){
                setAlertModal(alertModal)
            }

            if(!noUser){
                setUser({...user_CP, alertModal: null, usertype: 'customer'})
            }
        }
    }, [user_CP])

    const fetchCustomer = async () => {
        const url = `users/customers/single-customer/${customer_id}`
        const fetchedCustomer = await requestApi({ token: accessToken, url, method: 'get' })
        const { responseStatus, result, errorMsg } = fetchedCustomer
        if(responseStatus){
            const { data } = result 
            if(data){
                setUser_CP({ details: { ...data, usertype: 'customer' } })
            } else{
                setUser_CP({noUser: true})
            }
        } else{
            setUser_CP({noUser: true})
            // _setStatus({ isLoading: false, errorMsg: errorMsg.error })
        }
    }    

    const logout = () => {
        localStorage.clear()
        setAlertModal({message: 'logging you out...', callback: clearUser})
    }

    const clearUser = () => setUser_CP({noUser: true})

    if(user_CP){
        const { details } = user_CP
        
        if(details){

            return (
                <div>
                    <div className='bottom-border'>
                        <Usernavigation 
                            user_CP={user_CP}
                            setUser_CP={setUser_CP}
                            userRouterNavigateTo={userRouterNavigateTo}
                            logout={logout}
                        />
                    </div>
                    <Routes>

                        <Route 
                            path=''
                            element={
                                <Settingproperties 
                                    userRouterNavigateTo={userRouterNavigateTo}
                                    user_CP={user_CP}
                                    setUser_CP={setUser_CP}
                                    accessToken={accessToken}
                                    navigateTo={navigateTo}
                                />
                            }
                        />

                        <Route 
                            path='my-reservations'
                            element={
                                <Reservations 
                                    userRouterNavigateTo={userRouterNavigateTo}
                                    navigateTo={navigateTo}
                                    setUser_CP={setUser_CP}
                                    user_CP={user_CP}
                                    accessToken={accessToken}  
                                    allHotels={allHotels}                              
                                />
                            }
                        />

                    </Routes>

                    <ALert1 
                        customAlert={alertModal}
                    />
                </div>
            )

        } else{
            const logoutCallBack = () => setUser_CP(prev => ({
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

    return <Loading loadingText="loading profile" />
}