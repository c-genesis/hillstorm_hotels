import helpers from '../helpers/helpers';
import axios from "axios"

const { BaseUrl } = helpers

export const requestApi = async ({ url, method, data, token }) => {

    const headers = 
    { 
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8"    
    }

    if(token){
        headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
        url: `${BaseUrl}${url}`, 
        method, 
        data,
        headers
    }

    if(data){
        config.data = data
    }

    console.log(config.url)

    return axios(config)
    .then(response => {
        return { result: response.data, responseStatus: true }
    })
    .catch((error) => {
        console.log(error)
        if(error.response){
            //Request made and server responded
            return { responseStatus: false, errorMsg: error.response.data }
        } 


        else if(error.request){
            //Request made but no server response
            return { responseStatus: false, errorMsg: 'Server error, try again later' }
        } 
        
        
        else{
            return { responseStatus: false, errorMsg: 'Server error, try again later' }
        }
    }) 
}


export const cloudinaryUpload = async ({ files }) => {
    try {
        const formData = new FormData();
        const url = 'https://api.cloudinary.com/v1_1/dbiqk6dqh/upload'
    
        const uploadedFiles = []
    
        for (let i = 0; i < files.length; i++) {          
            let file = files[i];
            formData.append("file", file);
            formData.append("upload_preset", "hillstormes_hotels");
    
            const uploadedFile = await fetch(url, { method: 'POST', body: formData })
            const uploadedFile_data = await uploadedFile.text()         
            const parsedFile = JSON.parse(uploadedFile_data)
            
            const { secure_url } = parsedFile
            uploadedFiles.push(secure_url)
        }
        
        return { responseStatus: true, result: uploadedFiles, errorMsg: null }

    } catch (error) {
        return { 
            responseStatus: false, 
            result: null, 
            errorMsg: {
                error: 'An unexpected error occured, try again later',
                actualError: error
            } 
        }
    }
}