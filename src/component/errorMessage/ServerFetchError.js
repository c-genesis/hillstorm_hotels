import React from "react";

export default function ServerFetchError({ errorMsg }){
    return (
        <p>Error fetching from the server. Reason: {errorMsg}</p>
    )
}