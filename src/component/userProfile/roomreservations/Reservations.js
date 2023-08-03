import React, { useEffect, useRef, useState } from 'react'
import MyReservations from './MyReservations'
import Loading from '../../loading/Loading'
import { MdPendingActions } from 'react-icons/md'
import { AiFillCheckCircle } from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'
import { CSSTransition } from 'react-transition-group'
import { requestApi } from '../../apiRequests/requestApi'



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





export default function Reservations({ user_CP, setUser_CP, accessToken, allHotels }){
    const userProfileReservationsRef = useRef(null).current
    const userProfileReservationsRef2 = useRef(null).current
    const userProfileReservationsRef3 = useRef(null).current

    const allPendingRoomReservations = useRef()
    const allApprovedRoomReservations = useRef()
    const allCancelledRoomReservations = useRef()

    const [showPending, setShowPending] = useState(true)
    const [showApproved, setShowApproved] = useState(false)
    const [showCancelled, setShowCancelled] = useState(false)
    const [showReservationId, setShowReservationId] = useState({ visible: false, id: null })
    const [reservationCardFlip, setReservationCardFlip] = useState({ id: null, isFlipped: false })
    const [filter, setFilter] = useState('')
    const [roomReservations, setRoomReservations] = useState()
    const [primaryFilter, setPrimaryFilter] = useState('pending')
    const [showRoomCatalogueModal, setShowRoomCatalogueModal] = useState({ visible: false, roomDetails: {} })
    const [reservationIdModal, setReservationIdModal] = useState({ visible: false, code: '', hotelProfile: '' })
    const [secondaryFilter, setSecondaryFilter] = useState('valid')
    const [editReservationReqs, setEditReservationReqs] = useState({ isLoading: false, errorMsg: null, data: { reservation_id: '' } })

    const hideRoomCatalogueModal = () => setShowRoomCatalogueModal({ visible: false, roomDetails: {} })
    const hideReservationIdModal = () => setReservationIdModal({ visible: false, code: '', hotelProfile: '' })

    useEffect(() => {
        if(user_CP.details){ 
            allPendingRoomReservations.current = primarilyFilteredReservations({ filter: 'pending' })
            allApprovedRoomReservations.current = primarilyFilteredReservations({ filter: 'enrolled' })
            allCancelledRoomReservations.current = primarilyFilteredReservations({ filter: 'cancelled' })
            setRoomReservations(primarilyFilteredReservations({ filter: 'pending' }))            
        } else{
            setRoomReservations([])
        }
    }, []) 
    
    useEffect(() => {
        if(editReservationReqs.data){
            if(editReservationReqs.type == 'cancel'){
                cancelReservation({ requestBody: editReservationReqs.data, reservation: editReservationReqs.reservation })
            }
        }
    }, [editReservationReqs])


    const cancelReservation = async ({ requestBody, reservation }) => {
        const reservationCancelled = await requestApi({ url: 'users/customers/cancel-reservation', method: 'put', token: accessToken, data: requestBody })
        const { responseStatus, result, errorMsg } = reservationCancelled
        if(responseStatus){
            return fromPendingToCancel({ reservation, refundtype: requestBody.refundtype })
        } else{
            return setEditReservationReqs({ reservation_id: reservation.reservation_id, isLoading: false, errorMsg: errorMsg.error, data: {reservation_id: ''} })
        }
    }

    const fromPendingToCancel = ({ reservation, refundtype }) => {
        if(allPendingRoomReservations.current && allCancelledRoomReservations.current && user_CP.details){
            const allPendingRs = allPendingRoomReservations.current

            const filteredPendingRs = allPendingRs.filter(pendingR => pendingR.reservation_id != reservation.reservation_id)
            allPendingRoomReservations.current = filteredPendingRs

            allCancelledRoomReservations.current.push({
                ...reservation,
                status: 'cancelled'
            })
            
            setRoomReservations(allPendingRoomReservations.current)

            const updatedRoomReservations = user_CP.details.roomReservations.map(r => {
                if(r.reservation_id == reservation.reservation_id){
                    r.status = 'cancelled'
                }

                return r
            })

            const refundPercentage = refundtype == 'half' ? '50%' : '100%'

            setUser_CP(prev => ({
                ...prev,
                alertModal: {message: `successfully cancelled reservation, your ${refundPercentage} refund will arrive within the next half hour`, duration: 4000},
                details: {
                    ...prev.details,
                    roomReservations: updatedRoomReservations
                }
            }))
        }

        return setEditReservationReqs({ isLoading: false, errorMsg: null, data: {reservation_id: ''} })
    }

    const primarilyFilteredReservations = ({ filter }) => {
        if(user_CP.details){
            return user_CP.details.roomReservations.filter(r => 
                r.status.toLowerCase() == filter.toLowerCase()
            ) 
        } else{
            return []
        }     
    }


    if(user_CP && user_CP.details && roomReservations){

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

                setSecondaryFilter('valid')
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
            <div className='px-5 py-3'>
                <div>
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
                            nodeRef={userProfileReservationsRef3}
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
                            <div ref={userProfileReservationsRef3}>
                                <MyReservations
                                    user_CP={user_CP}
                                    roomReservations={roomReservations}
                                    setRoomReservations={setRoomReservations}
                                    filter={filter}
                                    setFilter={setFilter}
                                    showReservationId={showReservationId}
                                    setShowReservationId={setShowReservationId}
                                    reservationCardFlip={reservationCardFlip}
                                    showApproved={showApproved}
                                    showCancelled={showCancelled}
                                    setReservationCardFlip={setReservationCardFlip}   
                                    allReservations={allPendingRoomReservations.current}                                       
                                    hideRoomCatalogueModal={hideRoomCatalogueModal}               
                                    showRoomCatalogueModal={showRoomCatalogueModal}
                                    setShowRoomCatalogueModal={setShowRoomCatalogueModal}
                                    reservationIdModal={reservationIdModal}
                                    setReservationIdModal={setReservationIdModal}
                                    hideReservationIdModal={hideReservationIdModal}
                                    secondaryFilter={secondaryFilter}
                                    setSecondaryFilter={setSecondaryFilter}
                                    editReservationReqs={editReservationReqs}
                                    setEditReservationReqs={setEditReservationReqs}
                                />
                            </div>
                        </CSSTransition>                         

                        <CSSTransition                    
                            in={showApproved}
                            nodeRef={userProfileReservationsRef}
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
                            <div ref={userProfileReservationsRef}>
                                <MyReservations 
                                    user_CP={user_CP}
                                    roomReservations={roomReservations}
                                    setRoomReservations={setRoomReservations}
                                    filter={filter}
                                    allReservations={allApprovedRoomReservations.current}
                                    setFilter={setFilter}
                                    showApproved={showApproved}
                                    showReservationId={showReservationId}
                                    setShowReservationId={setShowReservationId}
                                    reservationCardFlip={reservationCardFlip}
                                    setReservationCardFlip={setReservationCardFlip}                                                  
                                    hideRoomCatalogueModal={hideRoomCatalogueModal}               
                                    showRoomCatalogueModal={showRoomCatalogueModal} 
                                    setShowRoomCatalogueModal={setShowRoomCatalogueModal} 
                                    reservationIdModal={reservationIdModal}
                                    setReservationIdModal={setReservationIdModal}
                                    showCancelled={showCancelled}
                                    hideReservationIdModal={hideReservationIdModal}   
                                    secondaryFilter={secondaryFilter}
                                    setSecondaryFilter={setSecondaryFilter}   
                                    editReservationReqs={editReservationReqs}
                                    setEditReservationReqs={setEditReservationReqs}
                                />
                            </div>
                        </CSSTransition> 

                        <CSSTransition                    
                            in={showCancelled}
                            nodeRef={userProfileReservationsRef2}
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
                            <div ref={userProfileReservationsRef2}>
                                <MyReservations 
                                    user_CP={user_CP}
                                    roomReservations={roomReservations}
                                    setRoomReservations={setRoomReservations}
                                    filter={filter}
                                    allReservations={allCancelledRoomReservations.current}
                                    setFilter={setFilter}
                                    showApproved={showApproved}
                                    showReservationId={showReservationId}
                                    showCancelled={showCancelled}
                                    setShowReservationId={setShowReservationId}
                                    reservationCardFlip={reservationCardFlip}
                                    setReservationCardFlip={setReservationCardFlip}                                                  
                                    hideRoomCatalogueModal={hideRoomCatalogueModal}               
                                    showRoomCatalogueModal={showRoomCatalogueModal} 
                                    setShowRoomCatalogueModal={setShowRoomCatalogueModal} 
                                    reservationIdModal={reservationIdModal}
                                    setReservationIdModal={setReservationIdModal}
                                    hideReservationIdModal={hideReservationIdModal}   
                                    secondaryFilter={secondaryFilter}
                                    setSecondaryFilter={setSecondaryFilter}   
                                    editReservationReqs={editReservationReqs}
                                    setEditReservationReqs={setEditReservationReqs}                                                                                                                                        
                                />
                            </div>
                        </CSSTransition>                                                
                    </div>                
                </div>              
            </div>
        )
    } else{
        return <Loading loadingText={'loading reservations'} />
    }
}