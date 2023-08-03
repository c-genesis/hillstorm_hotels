import React from "react";

export default function CustomErrorMsg({ errorMsg, noCenter }){
    return(
        <span className={`
            mb-4 d-flex 
            ${!noCenter && 'justify-content-center'}
            align-items-center text-uppercase`
        }>
            <span className="login-error-msg my-2 mx-1">{errorMsg}</span>        
        </span>
    )
}