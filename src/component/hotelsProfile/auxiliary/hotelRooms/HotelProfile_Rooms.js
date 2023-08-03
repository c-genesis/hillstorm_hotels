import React, { useEffect, useRef, useState } from "react";
import testCatalogue1 from '../../../../images/testHotel/testCatalogue1.png'
import testCatalogue2 from '../../../../images/testHotel/testCatalogue2.png'
import testCatalogue3 from '../../../../images/testHotel/testCatalogue3.png'
import testCatalogue4 from '../../../../images/testHotel/testCatalogue4.png'
import VerticalScroll from "../../../scroll/VerticalScroll";
import { CSSTransition } from 'react-transition-group'
import Auxiliary1 from "../Auxiliary1";
import { BsFillPlusCircleFill } from 'react-icons/bs'
import ZeroItems from "../../../ZeroItems/ZeroItems";
import RoomCatalogue from "./roomCreation&Edits/RoomCatalogue";
import RoomCreation from "./roomCreation&Edits/RoomCreation";

const testCatalogue = [testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4, testCatalogue1, testCatalogue2, testCatalogue3, testCatalogue4]

export default function HotelProfile_Rooms({ hotelRouterNavigateTo, user_HP, accessToken, setUser_HP }){

    const hotelProfileRoomsRef = useRef(null);
    const hotelProfileRoomsEditRef = useRef(null)

    const allHotelRooms = useRef()
    
    const [showAllRooms, setShowAllRooms] = useState(true)
    const [showRoomDetails, setShowRoomDetails] = useState(false)
    const [activeRoom, setActiveRoom] = useState()
    const [showEditRoom, setShowEditRoom] = useState(true)
    const [showEditRoomCatalogue, setShowEditRoomCatalogue] = useState(false)
    const [filter, setFilter] = useState('')
    const [hotelRooms, setHotelRooms] = useState([])

    useEffect(() => {
        if(user_HP){
            if(user_HP.details){
                allHotelRooms.current = user_HP.details.hotelRooms
                setHotelRooms(allHotelRooms.current)
                setFilter('')
            }
        }
    }, [user_HP])

    useEffect(() => {
        if(filter){
            const filteredRooms = allHotelRooms.current.filter(room => 
                room.room_id.toLowerCase().includes(filter)
                ||
                filter.includes(room.room_id.toLowerCase())
            )
            setHotelRooms(filteredRooms)
        } else{
            setHotelRooms(allHotelRooms.current)
        }
    }, [filter])
    
    const toggleShowRoomDetails = () => {
        if(activeRoom){
            setShowRoomDetails(prev => !prev)
        }
    }

    const onChangeFilter = e => {
        if(e){
            setFilter(e.target.value.toLowerCase())
        } else{
            setFilter('')
        }

        return
    }    

    const goToEditRoomDetails = () => setShowEditRoomCatalogue(false)
    const goToEditRoomCatalogue = () => setShowEditRoomCatalogue(true)

    const goToRoomReservations = () => {
        if(activeRoom){
            return setUser_HP(prev => ({
                ...prev,
                newRoute_HP: `room-reservations/${activeRoom.room_id}`,
                details: {
                    ...prev.details,
                    selectedRoom: activeRoom
                }
            }))
        }
    }

    if(user_HP){
        const { profileimg, hotelname, phonenumber, email, rating } = user_HP.details

        const displayHotelRooms = hotelRooms.map((room, i) => {
            const { hotel_id, catalogue, id, room_id } = room

            const profile = catalogue ? catalogue[0] : ''

            const setActive = () => setActiveRoom(room)
    
            const roomIsActive = activeRoom ? activeRoom.id == id ? true : false : false
    
            return (
                <div 
                    onClick={setActive}
                    key={i} 
                    style={{ 
                        cursor: "pointer",
                    }} 
                    className="col-lg-3 mb-2 d-flex justify-content-center"
                >
                    <div>
                        <img 
                            src={profile} 
                            className={`col-lg-11  mb-3`} 
                            style={{
                                transition: 'all 0.5s',
                                borderRadius: roomIsActive ? '20px' : '0'
                            }}
                        />
                        <p className="h-25 hotel-edit-profile-room-number text-center col-lg-11">{room_id}</p>
                    </div>
                </div>
            )
        })        

        return (
            <div className="pb-5">            
                <div style={{width: '100%'}} className="d-flex justify-content-between w-100">
                    <div className="col-lg-3">
                        <Auxiliary1 
                            img={activeRoom ? activeRoom.catalogue[0] : profileimg}
                            titleHeader={'Hotel Rooms'}
                            subHeader={activeRoom ? activeRoom.room_id : hotelname}
                            phone={phonenumber}
                            email={email}
                            isActive={activeRoom}
                            show={showRoomDetails}
                            showText={'All Rooms'}
                            hideText={'View Room'}
                            inActiveText={'Select a room'}
                            rating={rating}
                            toggleFunc1={toggleShowRoomDetails}
                            secondBtnFunc={goToRoomReservations}
                            secondBtnText={'Reservations'}
                        />
                    </div>
    
                    <div className="col-lg-9 px-3">
                        {
                            showAllRooms &&
                            <>
                                <div className="mb-4 pb-0 mx-3 col-lg-2">
                                    <h4 className="pb-2 hotel-profile-main-admin-profile-header bottom-border text-center">All Rooms</h4>
                                </div>
                                <VerticalScroll defaultHeight={'60vh'}>
                                    <div className="d-flex justify-content-end mx-3">
                                        <div className="d-flex mb-4 align-items-center col-lg-8 justify-content-end">
                                            <p className="single-hotel-filter-rooms-label-text m-0 p-0 text-end w-25">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                                                    <path d="M3.81787 2.45459L3.81787 22.5003" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                                    <path d="M14.2732 22.5005L14.2732 1.50021" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                                    <circle cx="3.81823" cy="16.7733" r="3.81823" fill="black"/>
                                                    <circle cx="3.34095" cy="3.34095" r="3.34095" transform="matrix(1 0 0 -1 10.4546 11.0454)" fill="black"/>
                                                </svg>
                                                <span className="mx-2">filter</span>
                                            </p>
                                            <input 
                                                type="text"
                                                onChange={onChangeFilter}
                                                value={filter}
                                                placeholder={'filter by room_id...'}
                                                className="w-75 single-hotel-filter-rooms-input py-2 px-2"
                                            />
                                        </div>  
                                    </div>                                    
                                    {
                                        hotelRooms.length > 0
                                        ?
                                            <div className="mx-3">                                              
                                                <div className="d-flex flex-wrap mb-4">
                                                    { displayHotelRooms }
                                                </div>  
                                                <div className="d-flex align-items-center justify-content-end mx-4">                                                    
                                                    <div className="d-flex align-items-center mx-4">
                                                        <div className="">
                                                            <p style={{fontWeight: '400'}} className="hotel-edit-profile-room-number p-0 m-0">Add New</p>
                                                        </div>
                                                        <button 
                                                            className="rounded-circle hover-rotate mx-2"
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
                                            </div>
                                        :
                                            <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
                                                <div className="d-flex flex-column">
                                                    <div className="mx-4 mb-1">
                                                        <ZeroItems zeroText={'Zero hotel rooms found'} />
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
                            </>                        
                        }  
    
                        <CSSTransition                    
                            in={showRoomDetails}
                            nodeRef={hotelProfileRoomsRef}
                            timeout={500}
                            classNames="alert"
                            unmountOnExit
                            onEnter={() => setShowAllRooms(false)}
                            onExited={() => setShowAllRooms(true)}
                        >
                            <div className="" ref={hotelProfileRoomsRef}>
                                <div className="mb-4 pb-0 mx-3 col-lg-6 d-flex justify-content-between">
                                    <h4 
                                        id="room_details"
                                        onClick={goToEditRoomDetails} 
                                        style={{
                                            opacity: showEditRoom ? 1 : 0.46
                                        }}                        
                                        className={`
                                            ${showEditRoomCatalogue ? "hotel-profile-room-creation-active-nav" : "hotel-profile-room-creation-inactive-nav"} 
                                            clickable col-lg-4 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center
                                        `}                    
                                    >
                                        Room Details
                                    </h4>
                                    <h4 
                                        id="room_catalogue"
                                        onClick={goToEditRoomCatalogue}  
                                        style={{
                                            opacity: showEditRoomCatalogue ? 1 : 0.46
                                        }}
                                        className={`
                                            ${showEditRoomCatalogue ? "hotel-profile-room-creation-active-nav" : "hotel-profile-room-creation-inactive-nav"} 
                                            clickable col-lg-6 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center
                                        `}
                                    >
                                        Room Catalogue
                                    </h4>
                                </div>
                                <VerticalScroll defaultHeight={'60vh'}>
                                    
                                    {
                                        showEditRoom &&
                                            <RoomCreation 
                                                user_HP={user_HP}
                                                accessToken={accessToken}
                                                goToCatalogue={null}
                                                activeRoom={activeRoom}
                                                setActiveRoom={setActiveRoom}                                             
                                                setUser_HP={setUser_HP}
                                            />                                        
                                    }

                                    <CSSTransition                    
                                        in={showEditRoomCatalogue}
                                        nodeRef={hotelProfileRoomsEditRef}
                                        timeout={500}
                                        classNames="alert"
                                        unmountOnExit
                                        onEnter={() => setShowEditRoom(false)}
                                        onExited={() => setShowEditRoom(true)}
                                    >   
                                        <div ref={hotelProfileRoomsEditRef}>
                                            <RoomCatalogue 
                                                user_HP={user_HP}
                                                newRoom={false}
                                                accessToken={accessToken}
                                                newRoomCreated={false}
                                                activeRoom={activeRoom}
                                                setUser_HP={setUser_HP}
                                                setActiveRoom={setActiveRoom}
                                            />
                                        </div>
                                    </CSSTransition>

                                </VerticalScroll> 
                            </div>
                        </CSSTransition>                                                              
                    </div>                                   
                </div>
            </div>
        )
    } else{
        return <></>
    }
}