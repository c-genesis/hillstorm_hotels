import React, { useEffect, useRef, useState } from "react";
import Auxiliary1 from "../Auxiliary1";
import RoomCreation from "./roomCreation&Edits/RoomCreation";
import { CSSTransition } from 'react-transition-group'
import RoomCatalogue from "./roomCreation&Edits/RoomCatalogue";


export default function HotelProfile_CreateRoom({ user_HP, specificRoom, accessToken, setUser_HP, hotelRouterNavigateTo }){
    const createRoomRef = useRef(null);

    const [showCatalogue, setShowCatalogue] = useState(false)
    const [showForm, setShowForm] = useState(true)
    const [activeNav, setActiveNav] = useState('create_room')
    const [newRoom, setNewRoom] = useState()

    useEffect(() => {
        if(showCatalogue){
            setActiveNav('room_catalogue')
        } else{
            setActiveNav('create_room')
        }
    }, [showCatalogue])
    
    useEffect(() => {
        if(newRoom){
            setShowCatalogue(true)
        }
    }, [newRoom])

    if(user_HP){

        const { details } = user_HP
        const { profileimg, hotelname, phonenumber, email, rating } = details

        const goToCatalogue = ({ newRoom }) => {
            if(newRoom){
                setNewRoom(newRoom)
            }
        }
        const goToForm = () => setShowCatalogue(false)

        const newRoomCreated = ({ latestRoom }) => {
            setNewRoom()
            if(user_HP.details.hotelRooms){
                const allRooms = [...user_HP.details.hotelRooms, latestRoom]
                setUser_HP(prev => ({
                    ...prev, 
                    newRoute: null,
                    alertModal: {message: 'hotel room successfully created'},
                    newRoute_HP: 'edit-hotel-rooms',
                    details: {
                        ...prev.details,
                        hotelRooms: allRooms
                    }
                }))
            } else{
                setUser_HP(prev => ({
                    ...prev,
                    newRoute: null,
                    alertModal: {message: 'hotel room successfully created'},
                    newRoute_HP: 'edit-hotel-rooms', 
                    details: {
                        ...prev.details,
                        hotelRooms: latestRoom
                    }
                }))
            }
        }

        return (
            <div className="pb-5">                       
                <div style={{width: '100%'}} className="d-flex justify-content-between w-100">
                    <div className={`col-lg-3`}>
                        <Auxiliary1 
                            img={profileimg}
                            titleHeader={'Create Room'}
                            subHeader={hotelname}
                            hideBtns={true}
                            phone={phonenumber}
                            email={email}
                            isActive={true}  
                            rating={rating}                    
                        />
                    </div>
                    <div className="col-lg-9 px-3">
                        <div className="mb-4 pb-0 mx-3 col-lg-6 d-flex justify-content-between">
                            <h4 
                                id="create_room"
                                onClick={() => setShowCatalogue(false)} 
                                style={{
                                    opacity: activeNav == 'create_room' ? 1 : 0.46
                                }}                        
                                className={`
                                    ${activeNav == "room_catalogue" ? "hotel-profile-room-creation-active-nav" : "hotel-profile-room-creation-inactive-nav"} 
                                    clickable col-lg-4 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center
                                `}                    
                            >
                                Create Room
                            </h4>
                            <h4 
                                id="room_catalogue" 
                                style={{
                                    opacity: activeNav == 'room_catalogue' ? 1 : 0.46
                                }}
                                className={`
                                    ${activeNav == "room_catalogue" ? "hotel-profile-room-creation-active-nav" : "hotel-profile-room-creation-inactive-nav"} 
                                    clickable col-lg-6 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center
                                `}
                            >
                                Room Catalogue
                            </h4>
                        </div>                         
                        {
                            showForm &&
                                <RoomCreation 
                                    activeRoom={specificRoom}
                                    goToCatalogue={goToCatalogue}
                                    user_HP={user_HP}
                                    accessToken={accessToken}
                                />                            
                        }
                        <CSSTransition                    
                            in={showCatalogue}
                            nodeRef={createRoomRef}
                            timeout={500}
                            classNames="alert"
                            unmountOnExit
                            onEnter={() => setShowForm(false)}
                            onExited={() => setShowForm(true)}
                        >
                            <div className="" ref={createRoomRef}>
                                <RoomCatalogue 
                                    user_HP={user_HP}
                                    newRoom={newRoom}
                                    newRoomCreated={newRoomCreated} 
                                    accessToken={accessToken}                                   
                                />
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