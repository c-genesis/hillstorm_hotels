import React, { useEffect, useState } from 'react'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { FaUserAlt, FaHotel } from 'react-icons/fa'
import { MdOutlineSettings } from 'react-icons/md'
import { LuLogOut } from 'react-icons/lu'
import { TbHomeCheck } from 'react-icons/tb'
import '../css/hotelProfile.css'
import { useLocation, useNavigate } from 'react-router-dom'
import Tooltip1 from '../../tooltips/Tooltip1'


const navLinks = [
    {
        Icon: TbHomeCheck,
        path: 'home',
        name: 'home',
        toolTipText: 'go home'
    },
    {
        Icon: FaUserAlt,
        path: '',
        name: 'profile',
        toolTipText: 'hotel profile'
    },  
    {
        Icon: FaHotel,
        path: 'edit-hotel-rooms',
        name: 'hotel_rooms',
        toolTipText: 'hotel rooms'
    },
    {
        Icon: BsFillPlusCircleFill,
        path: 'create-hotel-room',
        name: 'create_hotel_room',
        toolTipText: 'create hotel room'
    },
    {
        Icon: MdOutlineSettings,
        path: 'hotel-settings',
        name: 'hotel_settings',
        toolTipText: 'hotel settings'        
    },
    {
        Icon: LuLogOut,
        path: 'logout',
        toolTipText: 'logout hotel'
    },                 
]


export default function HotelProfileNavigation({ navigateTo, logout, hotelRouterNavigateTo }){
    const pathname = useLocation().pathname

    useEffect(() => {
        if(pathname.toLowerCase().includes('edit-hotel-rooms')){
            setActiveNav('hotel_rooms')
        } else if (pathname.toLowerCase().includes('create-hotel-room')) {
            setActiveNav('create_hotel_room')
        } else if (pathname.toLowerCase().includes('hotel-settings')) {
            setActiveNav('hotel_settings')
        } else if(pathname.toLowerCase().includes('room-reservations')){
            setActiveNav('')
        } else{
            setActiveNav('profile')
        }
    }, [pathname])

    const [activeNav, setActiveNav] = useState('profile')

    const displayNavLinks = navLinks.map((nav, i) => {
        const { Icon, name, path, toolTipText } = nav

        const isActive = name == activeNav ? true : false

        const changeRoute = () => {
            if(path == 'logout'){
                return logout()
            }

            if(path == 'home'){
                return navigateTo('/')
            }

            return hotelRouterNavigateTo(path)
        }

        return (            
            <div key={i} className='mb-4 pb-4'>
                <Tooltip1 
                    toolTipText={toolTipText}
                    id={`tooptip-1_${name}`}
                >
                    <Icon 
                        onClick={changeRoute}
                        style={{
                            color: isActive ? '#FFB901' : '#D9D9D9'
                        }} 
                        className='hotel-profile-nav-link' size={30} 
                    />  
                </Tooltip1>              
            </div>
        )
    })
    
    return (
        <div>
            { displayNavLinks }
        </div>
    )
}