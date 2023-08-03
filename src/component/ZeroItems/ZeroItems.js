import React from "react";
import { MdNoMeetingRoom } from 'react-icons/md'

import './css/ZeroItems.css'


export default function ZeroItems({ zeroText }){
    return (
        <div className="d-flex justify-content-center align-items-center">
            <MdNoMeetingRoom size={20} color="#FFB901" className="mx-2" />
            <p style={{color: '#000'}} className="m-0 p-0 mx-2 login-error-msg zero-items-text">{zeroText}</p>
        </div>
    )
}