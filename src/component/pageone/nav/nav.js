import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import LogoBlock from '../../../images/LogoBlock.svg'
import '../nav/nav.css'
import tie from '../../../images/tie.svg'
import city from '../../../images/city.svg'
import date from '../../../images/date.svg'
import admit from '../../../images/admit.svg'
import stroke from '../../../images/stroke.svg'
import search from '../../../images/search.svg'
import Tooltip1 from '../../tooltips/Tooltip1';
import { BiUserPin } from 'react-icons/bi'

function Nav({ navigateTo, user, setUser }) {

  const [active, setActive] = useState("side");
  const [toggleIcon, setToggleIcon] = useState("bars");

  const goToBookings = () => {
    if(user){
      if(user.details){
        //go to your bookings...
        return 
      }
    }

    return setUser(prev => ({...prev, alertModal:{message: 'login to your account to access your bookings'}}))
  }

  const navToggle = () => {
    active === "side"
      ? setActive("side side__active")
      : setActive("side");

    toggleIcon === "bars"
      ? setToggleIcon("bars work")
      : setToggleIcon("bars");
  }
  
  return (
    <div className='general'>
      <img src={LogoBlock} alt="" />
      <div onClick={navToggle} className={toggleIcon}>
        <div className="barer1"></div>
        <div className="barer2"></div>
        <div className="barer3"></div>
      </div>
      <div className={active}>
        <div className="searchcontainer">
          <div className="searchee">
            <img src={search} alt="" />
            <input type="search"  placeholder='Search for hotel, city, categories'  className='large'/>
          </div>
          <div className="suprise">
            <div className="supone"> <img src={city} alt="" /> City</div>
            <img src={stroke} alt="" />
            <div className="supone"> <img src={date} alt="" /> Date</div>
            <img src={stroke} alt="" />
            <div className="supone"> <img src={admit} alt="" /> Admit</div>
          </div>
        </div>
        <ul className='notordered'>
          <li className="lister"><Link to='/explore' className="explorer">Explore</Link></li>
          <li className="lister"><Link to='/learn' className="explorer">Learn</Link></li>
          <li className="lister"><Link to='/support' className="explorer">Support</Link></li>
          {
            user && user.details 
            ?
              <></>
            :
              <div className='d-flex'>
                <button 
                  className="lister listerone"
                  onClick={() => navigateTo('/login')}
                  // style={{letterSpacing: '0.2em'}}
                >
                  LOGIN
                </button>
                <button 
                  className="lister listerone listerone-black mx-2"
                  style={{
                    backgroundColor: '#1F1F1F'
                  }}
                  onClick={() => navigateTo('/sign-up')}
                  // style={{letterSpacing: '0.2em'}}
                >
                  REGISTER
                </button>                
              </div>
                          
          }
          <Tooltip1
            id={'tooltip1'}
            toolTipText={'check your room bookings'}            
          >
            <li className="lister">
              <img 
                onClick={goToBookings}
                src={tie} 
                alt="#" 
              />
            </li>
          </Tooltip1>
          {/* /hotel/profile */}

          {
            user && user.details && user.details.usertype == 'hotel' &&
              <Tooltip1
                toolTipText={'go to your profile'}
                id={'tooltip-1-hotel-profile'}
              >
                <li className="lister col-lg-2 d-flex-justify-content-center">
                  <img 
                    src={user.details.profileimg} 
                    alt="#" 
                    className='rounded-circle col-lg-8' 
                    onClick={() => navigateTo('/hotel/profile')}
                  />
                </li>
              </Tooltip1>                
          }

          {
            user && user.details && user.details.usertype == 'customer' &&
              <Tooltip1
                toolTipText={'go to your profile'}
                id={'tooltip-1-customer-profile'}
              >
                <li className="lister col-lg-2 d-flex-justify-content-center">
                  <img 
                    src={user.details.profileimg} 
                    alt="#" 
                    className='rounded-circle col-lg-8' 
                    onClick={() => navigateTo('/user/profile')}
                  />
                </li>
              </Tooltip1>                
          }          
        </ul>
      </div>
    </div>
  )
}

export default Nav