import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";

export default function DefaultPricing({
    pricing, selectedRoom, expiryDate, setPricingSelected, pricingSelected,
    goToCustomPricing
}){

    const [calendarValue, onChangeCalendarValue] = useState(new Date())
    const [isSelected, setIsSelected] = useState(false)

    useEffect(() => {
        if(calendarValue && isSelected){
            setPricingSelected(prev => ({...prev, s_date: calendarValue}))
        }
    }, [calendarValue])    


    const closeDefaultPricing = () => {
        setIsSelected(false)
        return goToCustomPricing()
    }

    const displayPricing = pricing && pricing.map((p, i) => {
        const { type, value } = p

        const selectPricing = () => { 
            setIsSelected(true)
            const length = 
                type == 'daily' ? 'day'
                :
                type == 'monthly' ? 'month'
                :
                type == 'weekly' ? 'week'
                : 
                ''             
            return setPricingSelected({value, len: length, add: 1, s_date: calendarValue })                              
        }

        return (
            <div key={i} className=''>
                <div className='mb-2'>
                    <label for="customer" className="login-form-label text-capitalize">
                        <input 
                            type="radio" 
                            name="price" 
                            value="price"
                            className="mx-2"
                            style={{accentColor: '#FFB901'}}
                            onChange={selectPricing}
                        />
                        {type}
                    </label>  
                </div> 
                <div className='mx-2 mb-1'>
                    <p className='m-0 p-0 login-form-label'>Price: &#8358;{value}</p>
                </div>                                                                          
            </div>
        )
    })     

    return (          

        <div>
            <div className=''>
                <div className='d-flex mb-4 justify-content-between align-items-start'>
                    <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3">
                        Default Pricing
                    </h6>
                    <h6 
                        onClick={closeDefaultPricing}
                        style={{
                            textDecoration: 'underline'
                        }} 
                        className="p-0 m-0 custom-placeholder clickable"
                    >
                        Use custom pricing?
                    </h6>
                </div> 
                <div className="mb-5">
                    <div className='d-flex justify-content-between'>    
                        { displayPricing }         
                    </div>
                </div>
                {
                    pricingSelected && expiryDate && isSelected &&
                        <div>
                            <div className='mb-4'>
                                <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3 mb-4">
                                    Reservation Duration
                                </h6>    
                                <div>
                                    <h6>
                                        <span className='single-hotel-hotel-room-count'>
                                            Starting:
                                        </span>
                                        <span className='login-form-label mx-2'>
                                            {calendarValue.toDateString()}
                                        </span>
                                    </h6>
                                    <h6>
                                        <span className='single-hotel-hotel-room-count'>
                                            Expiring:
                                        </span>
                                        <span className='login-form-label mx-2'>
                                            {expiryDate.toDateString()}
                                        </span>
                                    </h6>   
                                </div>                                                             
                                <Calendar 
                                    className="w-100 single-hotel-background-hotel-info-container"
                                    onChange={onChangeCalendarValue} 
                                    value={calendarValue}
                                />
                            </div>                                
                        </div>
                }                
            </div>             
        </div>
    )
}