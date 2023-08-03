import React, { useEffect, useState } from 'react'
import '../usernavigation/usernavigation.css'
import LogoBlock from '../../../images/LogoBlock.svg'
import { Outlet, useLocation } from "react-router-dom";
import NoState from '../../noState/NoState';
import { LuLogOut } from 'react-icons/lu'



const userNavLinks = [
    { 
        name: 'account_settings',
        path: '',
        title: 'Account Settings'
    },
    { 
        name: 'my_reservations',
        path: 'my-reservations',
        title: 'My Reservations'
    },
    {
        name: 'logout',
        title: 'Log out'
    }
]


function Usernavigation({ user_CP, userRouterNavigateTo, logout }) {
    const pathname = useLocation().pathname

    const [toggler, setToggler] = useState("navside");
    const [togglerbars, setTogglerbars] = useState("barss");
    const [activeNav, setActiveNav] = useState('')

    useEffect(() => {
        if(pathname.toLowerCase().includes('my-reservations')){
            setActiveNav('my_reservations')
        } else{
            setActiveNav('account_settings')
        }
    }, [pathname])

    const navToggler = () => {
        toggler === "navside" 
        ? setToggler("navside navside__togger")
        : setToggler("navside");

        togglerbars === "barss"
        ? setTogglerbars("barss work")
        : setTogglerbars("barss")
    }



    if(!user_CP){
        return <NoState />
    }

    const displayNavLinks = userNavLinks.map((link, i) => {
        const { name, path, title } = link

        const isActive = activeNav == name ? true : false

        const changeRoute = () => {
            if(name == 'logout'){
                return logout()
            }

            if(!isActive){
                return userRouterNavigateTo(path)
            }

            return;
        }

        return (
            <li 
                className="navlist"
                style={{
                    color: isActive ? '#FFB901' : '#1F1F1F'
                }}
                onClick={changeRoute}
            >
                {
                    name == 'logout' &&
                    <span>
                        <LuLogOut 
                            className='hotel-profile-nav-link mx-2' size={30}  
                            color='#1F1F1F'
                        />
                    </span>                    
                }                
                {title}
            </li>
        )
    })

    const { details } = user_CP
    const { profileimg, username } = details

  return (
    <>
    <div className="usergeneral">
        <div className=""><img src={LogoBlock} alt=""  className='col-lg-10'/> </div>
        
        <ul className={`${toggler}`}>
            {
                displayNavLinks
            }


            <div className='d-flex align-items-center'>
                <div className='col-lg-6'>
                    <img alt="#" src={profileimg} className='rounded-circle col-lg-12 mx-3' />
                </div>
            </div>
        </ul>


        <div onClick={navToggler} className={togglerbars}>
            <div className="barer1"></div>
            <div className="barer2"></div>
            <div className="barer3"></div>
        </div>
    </div>
    <Outlet />
    </>
  )
}

export default Usernavigation