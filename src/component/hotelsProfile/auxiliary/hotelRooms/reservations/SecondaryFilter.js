import React from "react";
import { MdPendingActions } from 'react-icons/md'
import { TbFilters } from 'react-icons/tb'


export default function SecondaryFilter({
    secondaryFilter, setSecondaryFilter, cancellationInitated,
    title, validFilterText, expiredFilterText,
    validFilterSubText, expiredFilterSubText
}){
    return (
        <div>
            <h4 className="single-hotel-rooms-title p-0 m-0 mb-3">
                <span>
                    <MdPendingActions color='#1F1F1F' size={30} />
                    <span className='mx-1'>{title} reservations</span>
                </span>
            </h4>
            <div className='d-flex mb-4'>
                <button
                    disabled={cancellationInitated}
                    onClick={() => setSecondaryFilter(true)}
                    style={{
                        backgroundColor: '#FFF',
                        opacity: secondaryFilter || cancellationInitated ? 1 : 0.46
                    }} 
                    className='single-hotel-filter-rooms-input py-2 px-2 gray-button'
                >
                    <p className='custom-placeholder m-0 p-0 d-flex align-items-center'>
                        {
                            secondaryFilter &&
                                <TbFilters size={20} color="#1F1F1F" className='mx-1 hover-rotate' />
                        }
                        <span>
                            {validFilterText}
                        </span>
                    </p>
                </button>
                <button 
                    onClick={() => setSecondaryFilter(false)}
                    disabled={cancellationInitated}                                            
                    style={{
                        backgroundColor: '#FFF',
                        opacity: !secondaryFilter || cancellationInitated ? 1 : 0.46
                    }}                                        
                    className='mx-2 single-hotel-filter-rooms-input py-2 px-2 gray-button'
                >
                    <p className='custom-placeholder m-0 p-0 d-flex align-items-center'>
                        {
                            !secondaryFilter &&
                                <TbFilters size={20} color="#1F1F1F" className='mx-1 hover-rotate' />
                        }  
                        <span>
                            {expiredFilterText}
                        </span>                                              
                    </p>
                </button>                                        
            </div>
            <div>
                <p className="m-0 p-0 login-form-label">
                    {
                        secondaryFilter
                        ?
                            <span>
                                {validFilterSubText}                                                 
                            </span>                                                    
                        :
                            <span>
                                {expiredFilterSubText}
                            </span>
                    }
                </p>
            </div>
        </div>        
    )
}