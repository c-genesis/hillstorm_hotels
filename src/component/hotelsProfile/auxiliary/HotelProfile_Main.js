import React, { useRef, useState } from "react";
import testCatalogue1 from '../../../images/testHotel/testCatalogue1.png'
import testCatalogue2 from '../../../images/testHotel/testCatalogue2.png'
import testCatalogue3 from '../../../images/testHotel/testCatalogue3.png'
import testCatalogue4 from '../../../images/testHotel/testCatalogue4.png'
import VerticalScroll from "../../scroll/VerticalScroll";
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { CSSTransition } from 'react-transition-group'
import EditHotelProfile from "./EditHotelProfile";
import Auxiliary1 from "./Auxiliary1";
import ZeroItems from "../../ZeroItems/ZeroItems";
import HotelProfile_Info from "./hotelInfo/HotelProfile_Info";

const testCatalogue = [testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4]

export default function HotelProfile_Main({ hotelRouterNavigateTo, user_HP, accessToken, setUser_HP }){
    const hotelProfileMainRef = useRef(null);
    const hotelProfileMainRef2 = useRef(null)

    const { details } = user_HP
    const { coverimg, profileimg, email, hotelname, phonenumber, hotelRooms, rating } = details
    
    const [showCatalogue, setShowCatalogue] = useState(true)
    const [showForm, setShowForm] = useState(false)

    const [showEditProfile, setShowEditProfile] = useState(true)
    const [showHotelInfo, setShowHotelInfo] = useState(false)

    const displayHotelRooms = hotelRooms && hotelRooms.map((hotelRoom, i) => {
        // const catalogue = JSON.parse(hotelRoom.catalogue)        

        const { catalogue } = hotelRoom
        
        const randImgOne = catalogue[Math.round(Math.random())]
        const randImgTwo = catalogue[Math.floor(Math.random() * (3 - 2 + 1) + 2)]

        return (
            [randImgOne, randImgTwo].map((img, index) => (
                <div 
                    key={`${i}_${index}`}
                    className="col-lg-3 mb-2 d-flex justify-content-start"
                    // onClick={zoomIn}
                >
                    <img src={img} className="col-lg-11" style={{cursor: 'zoom-in'}} />
                </div>
            ))
        )
    })
    

    const toggleShowForm = () => setShowForm(prev => !prev)

    const goToHotelInfo = () => setShowHotelInfo(true)
    const goToEditProfile = () => setShowHotelInfo(false)

    return (
        <div className="pb-5">            
            <div style={{width: '100%'}} className="d-flex justify-content-between w-100">
                <div className={`col-lg-3`}>
                    <Auxiliary1 
                        img={profileimg}
                        titleHeader={'Hotel Profile'}
                        subHeader={hotelname}
                        phone={phonenumber}
                        email={email}
                        isActive={true}
                        show={showForm}
                        showText={'Catalogue'}
                        hideText={'Edit Hotel'}
                        inActiveText={null}
                        toggleFunc1={toggleShowForm} 
                        rating={rating}                       
                    />
                </div>

                <div className="col-lg-9 px-3">
                    {
                        showCatalogue &&
                        <div className="">
                            <div className="mb-4 pb-0 mx-3 col-lg-2">
                                <h4 className="pb-2 hotel-profile-main-admin-profile-header bottom-border text-center">Catalogue</h4>
                            </div>
                            <VerticalScroll defaultHeight={'60vh'}>
                                { 
                                    hotelRooms &&
                                        hotelRooms.length > 0
                                        ?
                                            <div className="d-flex align-items-center flex-wrap mx-3">
                                                {displayHotelRooms}
                                            </div>
                                        :
                                            <div className="mx-3 d-flex flex-column justify-content-center align-items-center h-100">
                                                <div className="d-flex flex-column">
                                                    <div className="mx-4 mb-1">
                                                        <ZeroItems zeroText={'Zero hotel rooms set'} />
                                                    </div>
                                                    <button 
                                                        className="d-flex align-self-end my-4 rounded-circle hover-rotate"
                                                        onClick={() => hotelRouterNavigateTo('create-hotel-room')}
                                                    >
                                                        <BsFillPlusCircleFill 
                                                            color="#FFB901"
                                                            className='hotel-profile-nav-link' 
                                                            size={40} 
                                                        />  
                                                    </button> 
                                                </div>        
                                            </div>
                                }
                            </VerticalScroll>
                        </div>                        
                    }  

                    <CSSTransition                    
                        in={showForm}
                        nodeRef={hotelProfileMainRef}
                        timeout={500}
                        classNames="alert"
                        unmountOnExit
                        onEnter={() => setShowCatalogue(false)}
                        onExited={() => setShowCatalogue(true)}
                    >
                        <div className="" ref={hotelProfileMainRef}>
                            <div className="mb-4 pb-0 mx-3 col-lg-6 d-flex justify-content-between">
                                <h4 
                                    id="edit-profile"
                                    onClick={goToEditProfile} 
                                    style={{
                                        opacity: showEditProfile ? 1 : 0.46
                                    }}                        
                                    className={`
                                        ${
                                            'hotel-profile-room-creation-active-nav'
                                        } 
                                        clickable col-lg-4 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center
                                    `}                    
                                >
                                    Edit Profile
                                </h4>
                                <h4 
                                    id="hotel-information"
                                    onClick={goToHotelInfo}  
                                    style={{
                                        opacity: showHotelInfo ? 1 : 0.46
                                    }}
                                    className={`
                                        ${
                                            'hotel-profile-room-creation-active-nav'
                                        } 
                                        clickable col-lg-6 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center
                                    `}
                                >
                                    Hotel Information
                                </h4>
                            </div>
                            {
                                showEditProfile &&
                                    <VerticalScroll defaultHeight={'60vh'}>
                                        <EditHotelProfile user_HP={user_HP} accessToken={accessToken} setUser_HP={setUser_HP} />
                                    </VerticalScroll>                                 
                            }
                            <CSSTransition                    
                                in={showHotelInfo}
                                nodeRef={hotelProfileMainRef2}
                                timeout={500}
                                classNames="alert"
                                unmountOnExit
                                onEnter={() => setShowEditProfile(false)}
                                onExited={() => setShowEditProfile(true)}
                            >
                                <div ref={hotelProfileMainRef2}>
                                    <VerticalScroll defaultHeight={'60vh'}>                                    
                                        <HotelProfile_Info 
                                            user_HP={user_HP}
                                            setUser_HP={setUser_HP}
                                            accessToken={accessToken}
                                        />
                                    </VerticalScroll>
                                </div>
                            </CSSTransition>                            
                        </div>
                    </CSSTransition>                                                              
                </div>                                   
            </div>
        </div>
    )
}