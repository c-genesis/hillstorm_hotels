import React, { useEffect, useRef, useState } from 'react'
// import MyReservations from './MyReservations'
import { MdPendingActions } from 'react-icons/md'
import { AiFillCheckCircle } from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { CSSTransition } from 'react-transition-group'
import { requestApi } from '../../../../apiRequests/requestApi'
import Loading from '../../../../loading/Loading'
import { useParams } from 'react-router-dom'
import HotelReservations from './HotelReservations'
import VerticalScroll from '../../../../scroll/VerticalScroll'
import dayjs from 'dayjs'
import CreateReservation from './newReservation/CreateReservation'



const filterOptions = [
    {
        title: 'Pending',
        Icon: MdPendingActions,
        filterText: 'pending'
    },
    {
        title: 'Enrolled',
        Icon: AiFillCheckCircle,
        filterText: 'enrolled'        
    },
    {
        title: 'Cancelled',
        Icon: ImCancelCircle,
        filterText: 'cancelled'        
    },    
]





export default function HotelProfile_RoomReservations({ user_HP, setUser_HP, accessToken, hotelRouterNavigateTo }){
    const { room_id } = useParams()

    const hotelReservationsRef = useRef(null)
    const hotelProfileReservationsRef = useRef(null)
    const hotelProfileReservationsRef2 = useRef(null)
    const hotelProfileReservationsRef3 = useRef(null)

    const allPendingRoomReservations = useRef()
    const allApprovedRoomReservations = useRef()
    const allCancelledRoomReservations = useRef()

    const [showCreateReservation, setShowCreateReservation] = useState(false)
    const [showReservations, setShowReservations]= useState(true)
    const [selectedRoom, setSelectedRoom] = useState()
    const [showPending, setShowPending] = useState(true)
    const [showApproved, setShowApproved] = useState(false)
    const [showCancelled, setShowCancelled] = useState(false)
    const [reservationCardFlip, setReservationCardFlip] = useState({ id: null, isFlipped: false })
    const [filter, setFilter] = useState('')
    const [roomReservations, setRoomReservations] = useState()
    const [primaryFilter, setPrimaryFilter] = useState('pending')
    const [secondaryFilter, setSecondaryFilter] = useState(true)
    const [editReservationReqs, setEditReservationReqs] = useState({ isLoading: false, errorMsg: null, data: { reservation_id: '' } })

    const grabRoomFromParams = () => {
        if(user_HP.details){
            const activeRoom = user_HP.details.hotelRooms.filter(room => room.room_id == room_id)
            if(activeRoom.length > 0){
                setSelectedRoom(activeRoom[0])
            } else{
                hotelRouterNavigateTo('edit-hotel-rooms')    
            }
        }
    }
    
    useEffect(() => {
        if(user_HP.details && user_HP.details.selectedRoom){
            if(room_id){
                grabRoomFromParams()
            } else{
                hotelRouterNavigateTo('edit-hotel-rooms')
            }
        } else{
            grabRoomFromParams()
        }
    }, [user_HP])

    useEffect(() => {
        if(selectedRoom){ 
            allPendingRoomReservations.current = primarilyFilteredReservations({ filter: 'pending' })
            allApprovedRoomReservations.current = primarilyFilteredReservations({ filter: 'enrolled' })
            allCancelledRoomReservations.current = primarilyFilteredReservations({ filter: 'cancelled' })
            setRoomReservations(primarilyFilteredReservations({ filter: 'pending' }))            
        }
    }, [selectedRoom]) 
    
    useEffect(() => {
        if(editReservationReqs.data.reservation_id){
            alterReservation({ reqs: editReservationReqs })
        }
    }, [editReservationReqs])

    const goToReservations = () => setShowReservations(true)
    const goToForm = () => setShowReservations(false)

    const alterReservation = async ({ reqs }) => {
        const { data, reservation, url, method, functionCall } = reqs
         
        if(url){
            const reservationAltered = await requestApi({ url, method, token: accessToken, data })
            const { responseStatus, result, errorMsg } = reservationAltered
            if(responseStatus){
                if(functionCall == 'enrollCustomer'){
                    return enrollCustomer({ reservation })
                }
                if(functionCall == 'cancelReservationByHotel'){
                    return cancelReservationByHotel({ reservation })
                }       
                if(functionCall == 'exitHotel'){
                    return exitHotel({ reservation })
                }
            } else{
                return setEditReservationReqs({ reservation_id: reservation.reservation_id, isLoading: false, errorMsg: errorMsg.error, data: {reservation_id: ''} })
            } 
        }       
    }

    const updateUser = ({ updatedHotelRooms, alertModalMessage }) => {
        setReservationCardFlip({ id: null, isFlipped: false })

        setUser_HP(prev => ({
            ...prev,
            alertModal:{message: alertModalMessage, duration: 6000},
            details: {
                ...prev.details,
                hotelRooms: updatedHotelRooms
            }
        })) 
        
        return setEditReservationReqs({ isLoading: false, errorMsg: null, data: {reservation_id: ''} })
    }

    const removeFrom = ({ ref, reservation_id, valid }) => {
        if(ref && ref.current){
            const ref_specific = valid ? ref.current.valid : ref.current.expired
            const updatedRef_Spec = ref_specific.filter(p => p.reservation_id != reservation_id)
            if(valid){
                ref.current.valid = updatedRef_Spec
            } else{
                ref.current.expired = updatedRef_Spec                
            }
        }
        
        return
    }

    const cancelling = ({ 
        reservation_id, cancelledReservations, reservation, status, roomReservations,
        alertModalMessage
    }) => {
        //update selected room --> roomReservations
        const updatedRoomReservations = roomReservations.filter(r => r.reservation_id != reservation_id)

        //update selected room --> cancelledReservations
        const updatedCancelledReservations = [
            ...cancelledReservations, {...reservation, status}
        ]

        //update hotel rooms
        const updatedHotelRooms = user_HP.details.hotelRooms.map(hotelRoom => {
            if(hotelRoom.room_id == reservation.room_id){
                hotelRoom.roomReservations = updatedRoomReservations
                hotelRoom.cancelledReservations = updatedCancelledReservations
            }

            return hotelRoom
        })  
        
        //set user_HP
        return updateUser({
            updatedHotelRooms, alertModalMessage
        })         
    }

    const exitHotel = ({ reservation }) => {
        if(
            selectedRoom && allPendingRoomReservations.current && allCancelledRoomReservations.current
            && allApprovedRoomReservations.current
        ){
            const { roomReservations, cancelledReservations } = selectedRoom
            const { reservation_id } = reservation

            //remove from enrolled --> checked in
            removeFrom({ ref: allApprovedRoomReservations, reservation_id, valid: true })

            //add to enrolled --> check out
            allApprovedRoomReservations.current.expired.push({
                ...reservation, status: 'enrolled'
            })

            return cancelling({
                reservation, reservation_id, status: 'enrolled', roomReservations,
                alertModalMessage: 'Customer may now exit hotel', cancelledReservations
            })            
        } 
        
        return 
    }

    const cancelReservationByHotel = ({ reservation }) => {
        if(
            selectedRoom && allPendingRoomReservations.current && allCancelledRoomReservations.current
            && allApprovedRoomReservations.current
        ){
            const { roomReservations, cancelledReservations } = selectedRoom
            const { reservation_id } = reservation

            //remove from pending --> awaiting
            removeFrom({ ref: allPendingRoomReservations, reservation_id, valid: true })

            //add to cancelled --> by_hotel
            allCancelledRoomReservations.current.expired.push({
                ...reservation, status: 'by_hotel'
            })

            return cancelling({
                reservation, reservation_id, status: 'by_hotel', cancelledReservations,
                roomReservations, alertModalMessage: 'Successfully cancelled customer reservation'
            })           
        }

        return
    }

    const enrollCustomer = ({ reservation }) => {
        if(
            selectedRoom && allPendingRoomReservations.current && allCancelledRoomReservations.current
            && allApprovedRoomReservations.current
        ){
            const { roomReservations, cancelledReservations } = selectedRoom
            const { reservation_id } = reservation

            //remove from pending --> awaiting
            removeFrom({ ref: allPendingRoomReservations, reservation_id, valid: true })

            //add to enrolled --> enrolled_in
            allApprovedRoomReservations.current.valid.push({
                ...reservation, status: 'enrolled'
            })

            //update selected room --> roomReservations
            const updatedRoomReservations = roomReservations.map(r => {
                if(r.reservation_id == reservation_id){
                    r.status = 'enrolled'
                }
                
                return r
            })

            //update hotel rooms
            const updatedHotelRooms = user_HP.details.hotelRooms.map(hotelRoom => {
                if(hotelRoom.room_id == reservation.room_id){
                    hotelRoom.roomReservations = updatedRoomReservations
                }

                return hotelRoom
            })

            //set user_HP
            return updateUser({
                updatedHotelRooms, alertModalMessage: 'Successfully enrolled customer'
            })
        }

        return
    }


    const primarilyFilteredReservations = ({ filter }) => {
        if(selectedRoom){
            const { roomReservations, cancelledReservations } = selectedRoom
            if(filter == 'pending'){
                //all pending
                const pending_All = roomReservations.filter(r => r.status == 'pending')


                //all pending awaiting
                const pending_Awaiting = pending_All.filter(r => {
                    const { expirydate } = r
                    return dayjs(new Date()).isBefore(new Date(expirydate), 'day')
                }) 
                
                

                //all pending expired
                const pending_Expired = pending_All.filter(r => {
                    const { expirydate } = r
                    return dayjs(new Date()).isAfter(new Date(expirydate), 'day')
                })    

                return {
                    valid: pending_Awaiting, 
                    expired: pending_Expired
                }      
            }
            
            if(filter == 'enrolled'){
                //all enrolled in
                const enrolled_In = roomReservations.filter(r => r.status == 'enrolled')

                //all enrolled out
                const enrolled_Out = cancelledReservations.filter(cR => cR.status == 'enrolled')
                
                return {
                    valid: enrolled_In,
                    expired: enrolled_Out
                }
            }

            if(filter == 'cancelled'){
                //all cancelled by customer
                const cancelled_ByUser = cancelledReservations.filter(cR => cR.status == 'by_customer')

                //all cancelled by hotel after time elapsed
                const cancelled_ByHotel = cancelledReservations.filter(cR => cR.status == 'by_hotel')

                return {
                    valid: cancelled_ByUser,
                    expired: cancelled_ByHotel
                }
            }
        } 

        return {
            valid:[], expired:[]
        }
    }


    if(user_HP && user_HP.details && roomReservations && selectedRoom){

        const displayFilters = filterOptions.map((filterOpt, i) => {
            const { title, Icon, filterText } = filterOpt

            const isActive = primaryFilter == filterText ? true : false

            const makeActive = () => {
                if(filterText == 'enrolled'){
                    setShowApproved(true)
                    // setShowCancelled(false)
                    // setShowPending(false)
                } else if (filterText == 'pending'){
                    setShowPending(true)
                    // setShowApproved(false)
                    // setShowCancelled(false)
                } else{
                    setShowCancelled(true)
                    // setShowApproved(false)
                    // setShowPending(false)
                }

                setSecondaryFilter(true)
                setFilter('')
                return setPrimaryFilter(filterText)
            }

            return (
                <button 
                    key={i} 
                    onClick={makeActive}
                    disabled={editReservationReqs.isLoading ? true : false}
                    style={{
                        backgroundColor: '#FFF',
                        opacity: isActive ? 1 : 0.46
                    }}
                    className='d-flex align-items-center py-2 px-2 gray-button'
                >
                    <Icon size={25} color="#FFB901" />
                    <p className='clickable col-lg-4 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center m-0 p-0 mx-2'>
                        {title}
                    </p>
                </button>
            )
        })           

        return(
            <div className='px-3'>
                {
                    showCreateReservation &&
                        <CreateReservation 
                            goToReservations={goToReservations}
                            selectedRoom={selectedRoom}
                            accessToken={accessToken}
                        />
                }

                <CSSTransition                    
                    in={showReservations}
                    nodeRef={hotelReservationsRef}
                    timeout={500}
                    classNames="alert"
                    unmountOnExit
                    onEnter={() => setShowCreateReservation(false)}
                    onExited={() => setShowCreateReservation(true)}
                >         
                    <div ref={hotelReservationsRef}>    
                        <div className=''>
                            <div className='mb-2 px-3 d-flex justify-content-between align-items-center'>
                                <h4 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">
                                    Room Id <strong>{selectedRoom.room_id}</strong>
                                </h4>
                                <div className='d-flex align-items-center'>
                                    <p className="hotel-edit-profile-room-number p-0 m-0">
                                        Manally add reservation?
                                    </p>                    
                                    <button 
                                        onClick={goToForm}
                                        disabled={editReservationReqs.isLoading ? true : false}
                                        className="d-flex align-self-end my-4 rounded-circle mx-2 hover-rotate"
                                        style={{
                                            opacity: editReservationReqs.isLoading ? 0.66 : 1
                                        }}
                                    >
                                        <BsFillPlusCircleFill 
                                            color="#FFB901"
                                            className='hotel-profile-nav-link' 
                                            size={40} 
                                        />  
                                    </button>                         
                                </div>
                            </div>                
                            <VerticalScroll defaultHeight="70vh">
                                <div className='d-flex justify-content-center mb-5'>
                                    <div className="d-flex">
                                        {
                                            displayFilters
                                        }
                                    </div>
                                </div>

                                <div>
                                    <CSSTransition                    
                                        in={showPending}
                                        nodeRef={hotelProfileReservationsRef3}
                                        timeout={500}
                                        classNames="fade"
                                        unmountOnExit
                                        onEnter={() => {
                                            setShowApproved(false)
                                            setShowCancelled(false)
                                        }}
                                        onExited={() => 
                                            primaryFilter == 'cancelled' ? setShowCancelled(true) : setShowApproved(true)
                                        }
                                    >
                                        <div ref={hotelProfileReservationsRef3}>
                                            <HotelReservations
                                                user_HP={user_HP}
                                                roomReservations={roomReservations}
                                                setRoomReservations={setRoomReservations}
                                                filter={filter}
                                                setFilter={setFilter}
                                                reservationCardFlip={reservationCardFlip}
                                                showApproved={showApproved}
                                                showCancelled={showCancelled}
                                                setReservationCardFlip={setReservationCardFlip}   
                                                allReservations={allPendingRoomReservations.current}                                       
                                                secondaryFilter={secondaryFilter}
                                                setSecondaryFilter={setSecondaryFilter}
                                                editReservationReqs={editReservationReqs}
                                                setEditReservationReqs={setEditReservationReqs}
                                                selectedRoom={selectedRoom}
                                            />
                                        </div>
                                    </CSSTransition>                         

                                    <CSSTransition                    
                                        in={showApproved}
                                        nodeRef={hotelProfileReservationsRef}
                                        timeout={500}
                                        classNames="fade"
                                        unmountOnExit
                                        onEnter={() => {
                                            setShowPending(false)
                                            setShowCancelled(false)
                                        }}
                                        onExited={() => 
                                            primaryFilter == 'cancelled' ? setShowCancelled(true) : setShowPending(true)
                                        }
                                    >
                                        <div ref={hotelProfileReservationsRef}>
                                            <HotelReservations 
                                                user_HP={user_HP}
                                                roomReservations={roomReservations}
                                                setRoomReservations={setRoomReservations}
                                                filter={filter}
                                                allReservations={allApprovedRoomReservations.current}
                                                setFilter={setFilter}
                                                showApproved={showApproved}
                                                reservationCardFlip={reservationCardFlip}
                                                setReservationCardFlip={setReservationCardFlip}
                                                showCancelled={showCancelled} 
                                                secondaryFilter={secondaryFilter}
                                                setSecondaryFilter={setSecondaryFilter}   
                                                editReservationReqs={editReservationReqs}
                                                setEditReservationReqs={setEditReservationReqs}
                                                selectedRoom={selectedRoom}
                                            />
                                        </div>
                                    </CSSTransition> 

                                    <CSSTransition                    
                                        in={showCancelled}
                                        nodeRef={hotelProfileReservationsRef2}
                                        timeout={500}
                                        classNames="fade"
                                        unmountOnExit
                                        onEnter={() => {
                                            setShowPending(false)
                                            setShowApproved(false)
                                        }}
                                        onExited={() => 
                                            primaryFilter == 'pending' ? setShowPending(true) : setShowApproved(true)
                                        }
                                    >
                                        <div ref={hotelProfileReservationsRef2}>
                                            <HotelReservations 
                                                user_HP={user_HP}
                                                roomReservations={roomReservations}
                                                setRoomReservations={setRoomReservations}
                                                filter={filter}
                                                allReservations={allCancelledRoomReservations.current}
                                                setFilter={setFilter}
                                                showApproved={showApproved}
                                                showCancelled={showCancelled}
                                                reservationCardFlip={reservationCardFlip}
                                                setReservationCardFlip={setReservationCardFlip}   
                                                secondaryFilter={secondaryFilter}
                                                setSecondaryFilter={setSecondaryFilter}   
                                                editReservationReqs={editReservationReqs}
                                                setEditReservationReqs={setEditReservationReqs} 
                                                selectedRoom={selectedRoom}                                                                                                                                      
                                            />
                                        </div>
                                    </CSSTransition>                                                
                                </div>                
                            </VerticalScroll>              
                        </div>
                    </div>
                </CSSTransition>                   
            </div>
        )
    } else{
        return <Loading loadingText={'loading reservations'} />
    }
}