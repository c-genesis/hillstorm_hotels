import React, { useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import { FaScrewdriverWrench } from 'react-icons/fa6'
import { TiCancel } from 'react-icons/ti'
import CustomErrorMsg from "../../../../errorMessage/CustomErrorMsg";
import { cloudinaryUpload, requestApi } from "../../../../apiRequests/requestApi";
import { Spinner } from "react-bootstrap";

export default function RoomCatalogue({ 
    user_HP, newRoom, accessToken, newRoomCreated,
    activeRoom, setActiveRoom, setUser_HP
}){

    const isEdit = newRoom ? false : true

    const [createRoomReqs, setCreateRoomReqs] = useState()
    const [editRoomCatalogueReqs, setEditRoomCatalogueReqs] = useState()
    const [startLoading, setStartLoading] = useState(false)
    const [catalogueImages, setCatalogueImages] = useState(activeRoom ? activeRoom.catalogue : [])
    const [errorMsg, setErrorMsg] = useState()
    const [newCatalogueImage, setNewCatalogueImage] = useState()
    const [newImageErrorMsg, setNewImageErrorMsg] = useState({ index: null, error: null })

    const [openImageCatalogueSelector, {}] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: true,
        
        maxFileSize: 2,
        imageSizeRestrictions: {
            maxHeight: 1000,
            maxWidth: 2000,
            minHeight: 100,
            minWidth: 200,
        },
        onFilesRejected: ({ errors }) => {
            setErrorMsg('Invalid file size or dimension')
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const images = filesContent.map(file => file.content)
            if(images.length > 4){
                return setErrorMsg('Cannot select more than 4')
            }
            if(images.length < 4){
                return setErrorMsg('Must be up to 4')
            }
            setCatalogueImages(images)
        },
    });   
    
    const [openSingleImageCatalogueSelector, { }] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,        
        maxFileSize: 2,
        imageSizeRestrictions: {
            maxHeight: 1000,
            maxWidth: 2000,
            minHeight: 100,
            minWidth: 200,
        },
        onFilesRejected: ({ errors }) => {
            setNewImageErrorMsg({ index: newCatalogueImage.index, error: 'Invalid file size or dimension' })
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const { content } = filesContent[0]
            setNewImageErrorMsg({ index: null, error: null })
            setNewCatalogueImage(prev => ({...prev, image: content}))
        },
    });  
    
    useEffect(() => {
        if(activeRoom){
            setNewCatalogueImage()
        }
    }, [activeRoom])

    useEffect(() => {
        if(newCatalogueImage){
            if((newCatalogueImage.index || newCatalogueImage.index == 0) && !newCatalogueImage.image){
                openSingleImageCatalogueSelector()
            }            
        }
    }, [newCatalogueImage])

    useEffect(() => {
        if(createRoomReqs){
            createRoom({ reqs: createRoomReqs })
        }
    }, [createRoomReqs])

    useEffect(() => {
        if(editRoomCatalogueReqs){
            editRoomCatalogue({ reqs: editRoomCatalogueReqs })
        }
    }, [editRoomCatalogueReqs])

    const createRoom = async ({ reqs }) => {
        const roomCatalogue = await requestApi({ url: 'users/hotels/create-room', method: 'post', data: reqs, token: accessToken })
        const { result, responseStatus, errorMsg } = roomCatalogue        
        if(responseStatus){
            const { data } = result        
            newRoomCreated({ latestRoom: data })         
        } else{
            setErrorMsg(`${errorMsg.error} Or try using a different room id`)
        }

        setStartLoading(false)
        return setCreateRoomReqs()
    }

    const roomEditted = ({ edittedRoom }) => {
        if(edittedRoom){
            const { room_id, catalogue } = edittedRoom
            const edittedHotelRooms = user_HP.details.hotelRooms.map(room => {
                if(room.room_id == room_id){
                    room = edittedRoom
                }
                return room
            })
            setUser_HP(prev => ({
                ...prev,
                alertModal: {message: 'hotel room catalogue successfully updated'},
                newRoute: null,
                newRoute_HP: null, 
                details: {
                    ...prev.details,
                    hotelRooms: edittedHotelRooms
                }
            }))
            
            setActiveRoom({
                ...edittedRoom, catalogue
            })

            setCatalogueImages(catalogue)
        }
    }


    const editRoomCatalogue = async ({ reqs }) => {
        const newRoom = await requestApi({ url: 'users/hotels/edit-room', method: 'put', data: reqs, token: accessToken })
        const { responseStatus, result, errorMsg } = newRoom
        if(responseStatus){
            const { data } = result
            roomEditted({ edittedRoom: data })
        } else{
            setNewImageErrorMsg({ index: 'all', errorMsg: errorMsg.error })
        }

        setStartLoading(false)
        return setEditRoomCatalogueReqs()
    }

    const initiateRoomCreation = async () => {
        setErrorMsg('')
        setStartLoading(true)
        if(catalogueImages.length > 0){
            const imageUrls = await cloudinaryUpload({ files: catalogueImages })
            const { result, responseStatus, errorMsg } = imageUrls
            if(responseStatus && result){
                return setCreateRoomReqs({ ...newRoom, catalogue: JSON.stringify(result), hotel_id: user_HP.details.hotel_id })
            } else {
                setStartLoading(false)
                return setErrorMsg(errorMsg.error)
            }
        } else{
            setStartLoading(false)
            return setErrorMsg('Select Images for your catalogue')
        }
    }

    const selectImages = () => {
        setErrorMsg()
        openImageCatalogueSelector()
    }

    const discardImages = () => setCatalogueImages([])
    const discardNewImage = () => setNewCatalogueImage()

    const initiateRoomCatalogueEdit = async ({ index }) => {
        setStartLoading(true)
        setNewImageErrorMsg({ index: null, error: null })
        if(newCatalogueImage){
            const { index, image } = newCatalogueImage
            const imageUrl = await cloudinaryUpload({ files: [image] })
            const { responseStatus, result, errorMsg } = imageUrl
            if(responseStatus){
                const filteredCatalogue = catalogueImages.map((img, i) => {
                    if(i == index){
                        img = result[0]
                    }
                    return img
                })
                setEditRoomCatalogueReqs({
                    room_id: activeRoom.room_id,
                    catalogue: JSON.stringify(filteredCatalogue)
                })
            } else{
                setStartLoading(false)
                return setNewImageErrorMsg({ index, error: errorMsg.error })
            }
        } else{
            setStartLoading(false)
            return setNewImageErrorMsg({ index, error: 'Error updating image' })
        }
    }

    const displayCatalogueImages = catalogueImages.map((image, i) => {

        const selectNewCatalogueImage = () => setNewCatalogueImage({ index: i })

        let img = image
        let isBeingChanged = false
        let errorMsg = newImageErrorMsg.index == i ? newImageErrorMsg.error : null
        if(newCatalogueImage){
            if((newCatalogueImage.index || newCatalogueImage.index == 0)){
                if(newCatalogueImage.index == i && newCatalogueImage.image){
                    img = newCatalogueImage.image
                    isBeingChanged = true
                }
            }
        }

        const setupRoomCatalogueEdit = () => initiateRoomCatalogueEdit({ index: i })

        return (
            <div key={i} className="col-lg-3 d-flex flex-column mb-4 rounded-0">
                {
                    errorMsg &&
                        <div className="col-lg-8 text-center">
                            <CustomErrorMsg errorMsg={errorMsg} />
                        </div>
                }
                <img src={img} alt={'catalogue image'} style={{borderRadius: 0, transition: 'all 1s'}} 
                    className="col-lg-11 mb-3" 
                />
                {
                    isEdit 
                    ?
                        <div className="col-lg-11 d-flex justify-content-center">
                            {
                                isBeingChanged
                                ?
                                    <div className="d-flex">
                                        <button 
                                            onClick={setupRoomCatalogueEdit}
                                            disabled={(startLoading || editRoomCatalogueReqs) ? true : false}
                                            style={{ 
                                                opacity: (startLoading || editRoomCatalogueReqs) ? 0.76 : 1
                                            }}
                                            className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1"
                                        >
                                            {
                                                (startLoading || editRoomCatalogueReqs) &&
                                                    <span><Spinner size="sm" className="mx-2" /></span>                                                    
                                            } 
                                            {
                                                (startLoading || editRoomCatalogueReqs) ? 'Saving' : 'Save'
                                            }
                                        </button>
                                        {
                                            (startLoading || editRoomCatalogueReqs)
                                            ?
                                                <></>
                                            :
                                                <button 
                                                    onClick={discardNewImage}
                                                    style={{ background: '#1F1F1F' }}
                                                    className="hotel-profile-main-admin-profile-btn border-0 px-2 py-1 mx-1 black-button"
                                                >
                                                    <TiCancel size={25} />
                                                </button>                                            
                                        }                                         
                                    </div>
                                :
                                    <button 
                                        onClick={selectNewCatalogueImage}
                                        style={{ background: '#1F1F1F' }}
                                        className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 black-button"
                                    >
                                        <FaScrewdriverWrench size={15} />
                                    </button>                               
                            }
                        </div>  
                    :
                        <></>                          
                }
            </div>
        )
    })

    return (
        <div>
            <div className="py-3 mx-3">
                {
                    !isEdit &&
                        <div className="mb-5">
                            <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1 mb-3">Room Catalogue</h6>
                            <p className="login-form-label mb-2 col-lg-8">
                                Pick 5 images for your room catalogue. Images must be within the dimensions 200x100 and 2000x1000 and less than 2mb
                            </p>
                        </div>
                }
                {
                    catalogueImages.length > 0
                    ?
                        <div>
                            {
                                errorMsg && <CustomErrorMsg errorMsg={errorMsg} />
                            } 
                            {
                                newImageErrorMsg.index == 'all' && newImageErrorMsg.error && <CustomErrorMsg errorMsg={newImageErrorMsg.error} />
                            }                                                        
                            <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap w-100">
                                { displayCatalogueImages }
                            </div>
                            {
                                !isEdit &&
                                    <div className="d-flex">
                                        <button 
                                            onClick={initiateRoomCreation}                                            
                                            className="login-form-btn p-3 text-center"
                                            disabled={(createRoomReqs || startLoading) ? true : false}
                                            style={{
                                                opacity: (createRoomReqs || startLoading) ? 0.76 : 1
                                            }}
                                        >
                                            { (createRoomReqs || startLoading) && <Spinner size="sm" /> }
                                            <span className={(createRoomReqs || startLoading) && 'mx-2'}>
                                                {
                                                    (createRoomReqs || startLoading) ? 'Creating...' : 'Create room'
                                                }
                                            </span>
                                        </button>
                                        <button 
                                            onClick={discardImages}
                                            className="mx-3 login-form-btn p-3 black-button"
                                        >
                                            Discard
                                        </button>                                 
                                    </div>                                
                            }
                        </div>
                    :
                        <div>
                            {
                                errorMsg && <CustomErrorMsg errorMsg={errorMsg} />
                            }                                                     
                            <div className="d-flex justify-content-center w-100 pointer">
                                <button 
                                    onClick={selectImages}
                                    className="p-3 gray-button hotel-profile-room-catalogue-select-images-container"
                                >
                                    <div className='p-5'>
                                        <span style={{fontWeight: '500'}} className="login-form-label">Click to select images</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}