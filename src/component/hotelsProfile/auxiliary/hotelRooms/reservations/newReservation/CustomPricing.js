import React, { useState } from 'react'
import CustomErrorMsg from '../../../../../errorMessage/CustomErrorMsg'
import { ONLY_NUMBERS_REG_EXP, getDatesRange } from '../../../../../globals/globals'
import dayjs from 'dayjs'
import { BsFillCalendarCheckFill } from 'react-icons/bs'

export default function CustomPricing({
    goToDefaultPricing, setPricingSelected, pricingSelected
}){

    const [errorMsg, setErrorMsg] = useState({ error: null, changeType: null })
    const [amountInput, setAmountInput] = useState()
    const [startingInput, setStartingInput] = useState()
    const [expiringInput, setExpiringInput] = useState()

    const handleAmountInput = e => {
        if(e){
            reset()
            setAmountInput(e.target.value)
        }
        return;
    }
    
    const handleStartingInput = e => {
        if(e){
            reset()
            setStartingInput(e.target.value)
        }
        return;
    }

    const handleExpiringInput = e => {
        if(e){
            reset()
            setExpiringInput(e.target.value)
        }
        return;
    }   
    
    const reset = () => {
        setErrorMsg({ error: null, changeType: null })
        setPricingSelected()
        return;
    }

    const amountValid = ({ amountVal }) => {
        if(!amountVal){
            setErrorMsg({ error: 'Amount required', changeType: 'amount' })
            return false
        }

        if(!(amountVal.match(ONLY_NUMBERS_REG_EXP))){
            setErrorMsg({ error: 'Amount must be figures only!', changeType: 'amount' })
            return false
        }

        if(amountVal <= 0){
            setErrorMsg({ error: 'Amount must be greater than 0!', changeType: 'amount' })
            return false
        }

        return true
    }

    const setDate = () => {
        setPricingSelected()

        if(!amountValid({ amountVal: amountInput })){
            return
        }

        if(!startingInput || !expiringInput){
            return setErrorMsg({ error: 'Starting and Expiring dates required', changeType: 'date' })
        }

        const start = new Date(startingInput)
        const expire = new Date(expiringInput)

        if(dayjs(expire).isBefore(dayjs(start), 'day')){
            return setErrorMsg({ error: 'Exprie date cannot be before start date', changeType: 'date' })
        }

        const dateRange = getDatesRange(start, expire)

        return setPricingSelected({
            len: 'custom',
            s_date: start,
            add: (dateRange.length-1),
            value: amountInput
        })
    }

    return (
        <div>
            <div className=''>
                <div className='d-flex mb-4 justify-content-between align-items-start'>
                    <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3">
                        Custom Pricing
                    </h6>
                    <h6 
                        onClick={goToDefaultPricing}
                        style={{
                            textDecoration: 'underline'
                        }} 
                        className="p-0 m-0 custom-placeholder clickable"
                    >
                        Use default pricing?
                    </h6>
                </div> 
                <div>
                    <div className="mb-5">
                        <label htmlFor="amount" className="login-form-label mb-2">Amount</label>
                        <br/>
                        <input 
                            value={amountInput}
                            onChange={handleAmountInput}
                            name="amount"
                            placeholder="Amount figure"
                            className="login-form-input-field p-2 w-100"
                            type="number"
                        />
                        {
                            errorMsg && errorMsg.changeType == 'amount' &&
                                <CustomErrorMsg errorMsg={errorMsg.error} />
                        }                                                                                              
                    </div>
                    <div className='mb-4'>
                        <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3 mb-4">
                            Reservation Duration
                        </h6>   
                        {
                            errorMsg && errorMsg.changeType == 'date' &&
                                <CustomErrorMsg errorMsg={errorMsg.error} />
                        }                                             
                        <div className='d-flex justify-content-between'>
                            <div>
                                <label htmlFor="start_date" className="login-form-label text-capitalize mb-2">Start Date</label>
                                <input 
                                    name='start_date'
                                    type='date' 
                                    value={startingInput}
                                    onChange={handleStartingInput}
                                    className="login-form-input-field p-2 w-100 mb-3"
                                />
                                <p className='p-0 m-0 custom-placeholder'>
                                    {
                                        startingInput && new Date(startingInput).toDateString()
                                    }
                                </p>
                            </div>
                            <div>
                                <label htmlFor="expiry_date" className="login-form-label text-capitalize mb-2">Expiry Date</label>
                                <input 
                                    name='expiry_date'
                                    type='date'
                                    value={expiringInput}
                                    onChange={handleExpiringInput}
                                    className="login-form-input-field p-2 w-100 mb-3"
                                />
                                <p className='p-0 m-0 custom-placeholder'>
                                    {
                                        expiringInput && new Date(expiringInput).toDateString()
                                    }
                                </p>                                
                            </div>                            
                        </div>                        
                    </div>
                    {
                        !pricingSelected 
                        ?
                            <button
                                onClick={setDate}
                                className="login-form-btn p-3 black-button"
                            >
                                <span className='mx-2'>
                                    <BsFillCalendarCheckFill size={18} color='#FFFFFF' />
                                </span>
                                <span>
                                    Set Date
                                </span>
                            </button>
                        :
                            <div className='d-flex justify-content-center'>
                                <div>
                                    <p
                                        className="p-0 m-0 custom-placeholder"                                     
                                    >
                                        <BsFillCalendarCheckFill size={20} color='#FFB901' />
                                        <span className='mx-2'>
                                            Date set!
                                        </span>
                                    </p>
                                </div>
                            </div> 
                    }              
                </div>               
            </div>                        
        </div>
    )
}