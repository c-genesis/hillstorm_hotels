import React, { useEffect, useState } from 'react'
import DisplayRoomReservations from './DisplayRoomReservations';
import SecondaryFilter from './SecondaryFilter';



export default function HotelReservations({ 
    roomReservations, showApproved, filter, setFilter, setRoomReservations, allReservations,
    reservationCardFlip, setReservationCardFlip,
    selectedRoom, secondaryFilter, setSecondaryFilter, showCancelled,
    editReservationReqs, setEditReservationReqs
 }){

    const isPending = !showApproved && !showCancelled
    const cancellationInitated = editReservationReqs ? editReservationReqs.isLoading : false

    useEffect(() => {
        if(selectedRoom){
            if(filter){
                const filterFrom = secondaryFilter ? allReservations.valid : allReservations.expired
                const editted = secondaryFilter ? 'valid' : 'expired'
                const filteredReservations = filterFrom.filter(r => 
                    r.username.toLowerCase().includes(filter) || filter.includes(r.username.toLowerCase())
                    ||
                    r.email.toLowerCase().includes(filter) || filter.includes(r.email.toLowerCase())
                    ||
                    r.reservation_id.toLowerCase().includes(filter) || filter.includes(r.reservation_id.toLowerCase())
                )
                setRoomReservations(prev => ({
                    ...prev,
                    [editted]: filteredReservations
                }))
            } else{
                setRoomReservations(allReservations)
            }
        } else{
            setRoomReservations({
                valid: [], expired: []
            })
        }
    }, [filter])   

    const onChangeFilter = e => {
        if(e){
            setFilter(e.target.value.toLowerCase())
        } else{
            setFilter('')
        }

        return
    }

    return (
        <div className='px-3'>
            <div>
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="col-lg-6">
                        {
                            showApproved 
                            ?
                                <SecondaryFilter 
                                    secondaryFilter={secondaryFilter}
                                    setSecondaryFilter={setSecondaryFilter}
                                    cancellationInitated={cancellationInitated}
                                    title={'Enrolled'}
                                    validFilterText={'Checked In'}
                                    expiredFilterText={'Checked Out'}
                                    validFilterSubText={`
                                        Showing reservations which customers are currently occupying`
                                    }
                                    expiredFilterSubText={`
                                        Show reservations which customers have occupied before
                                    `}
                                />                                                                     
                            :
                            showCancelled
                            ?
                                <SecondaryFilter 
                                    secondaryFilter={secondaryFilter}
                                    setSecondaryFilter={setSecondaryFilter}
                                    cancellationInitated={cancellationInitated}
                                    title={'Cancelled'}
                                    validFilterText={'By User'}
                                    expiredFilterText={'By Hotel'}
                                    validFilterSubText={`
                                        Reservations where customers received a refund after cancelling
                                        Customers are to contact support@hillstourhomes.com for any of these they did not receive a refund for`
                                    }
                                    expiredFilterSubText={`
                                        Reservations which customers did not cancel nor meetup with the reservation in time.
                                        These were cancelled by this hotel and a refund was made to the customer depending on when this was cancelled
                                    `}
                                />                                 
                            :
                                <SecondaryFilter 
                                    secondaryFilter={secondaryFilter}
                                    setSecondaryFilter={setSecondaryFilter}
                                    cancellationInitated={cancellationInitated}
                                    title={'Pending'}
                                    validFilterText={'Awaiting'}
                                    expiredFilterText={'Expired'}
                                    validFilterSubText={`
                                        Showing all pending reservations that are still valid.
                                        Customers may cancel now to get a refund of their cash paid during reservation`
                                    }
                                    expiredFilterSubText={`
                                        Showing all pending reservations whose duration has elapsed.
                                        Cancel now to move it to cancelled reservations
                                    `}
                                />
                        }
                    </div>                    
                    <div className="d-flex mb-4 align-items-center col-lg-6 justify-content-end">
                        <p className="single-hotel-filter-rooms-label-text m-0 p-0 text-end w-25">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                                <path d="M3.81787 2.45459L3.81787 22.5003" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                <path d="M14.2732 22.5005L14.2732 1.50021" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                <circle cx="3.81823" cy="16.7733" r="3.81823" fill="black"/>
                                <circle cx="3.34095" cy="3.34095" r="3.34095" transform="matrix(1 0 0 -1 10.4546 11.0454)" fill="black"/>
                            </svg>
                            <span className="mx-2">search filter</span>
                        </p>
                        <input 
                            type="text"
                            onChange={onChangeFilter}
                            value={filter}
                            style={{
                                opacity: cancellationInitated ? 0.76 : 1
                            }}
                            disabled={cancellationInitated}
                            placeholder={cancellationInitated ? 'cancellation in progress. cannot filter' : 'filter: hotel name or room id or reservation id...'}
                            className="w-75 single-hotel-filter-rooms-input py-2 px-2"
                        />
                    </div>                     
                </div>
                {
                    roomReservations &&
                        <DisplayRoomReservations
                            roomReservations={
                                secondaryFilter ? roomReservations.valid : roomReservations.expired
                            }
                            setReservationCardFlip={setReservationCardFlip} 
                            isPending={isPending}
                            setEditReservationReqs={setEditReservationReqs}
                            editReservationReqs={editReservationReqs}
                            reservationCardFlip={reservationCardFlip}  
                            showApproved={showApproved}                             
                            showCancelled={showCancelled}
                            secondaryFilter={secondaryFilter}
                        />                    
                }                
            </div>            
        </div>
    )
}