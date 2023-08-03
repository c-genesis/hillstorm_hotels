import React from 'react'
import styles from './hero.module.css'
import mosque from '../../../images/mosque.svg'
import { sliding } from '../../data'
import Labelnew from '../../../images/Labelnew.svg'
import linestroke from '../../../images/linestroke.svg'
import Loading from '../../loading/Loading'
import ServerFetchError from '../../errorMessage/ServerFetchError'
import { Carousel } from 'react-bootstrap'
import ZeroItems from '../../ZeroItems/ZeroItems'

function Hero({ allHotels, setActiveHotel }) {

  const displayHotelsCarousel = allHotels.data && allHotels.data.map((hotel, i) => {
    const { coverimg, profileimg, hotelname, hotelRooms, country, state, hotel_id } = hotel

    const setAsActive = () => setActiveHotel && setActiveHotel({ 
      roomIdSelected: null, hotelDetails: hotel, newRoute: `hotels/single-hotel/${hotel_id}`
    })

    const showHotelRooms = hotelRooms.map((room, i) => {
      const { catalogue } = room
      return (
        <>
          <div className={styles.slidercontainer} key={i}>
            <img src={catalogue[0]} alt="" className='col-lg-4 rounded-3' />
            <img src={linestroke} alt="" />
            <div className={styles.namesandratings}>
              <div className={`${styles.names} mb-1`}>{hotelname}</div>
              <button
                className="login-form-btn w-100 px-1 py-1"
                style={{fontSize: 14}}
              >
                Book
              </button>
            </div>
            <img src={Labelnew} alt="newlabel"  className={styles.placement}/>
          </div>
        </>
      )
    })

    return (
        <Carousel.Item key={i}>
            <div 
              className="background-image d-flex flex-column justify-content-between p-4 mb-2"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, rgba(31, 31, 31, 0.35), rgba(31, 31, 31, 0.35)), 
                  url(${coverimg})`,                
                height: '85vh',
                width: '100%',
                borderRadius: '20.155px 20.155px 0px 0px'
              }}
            >
              <div className='d-flex w-100 justify-content-end'>
                <button 
                  className={`${styles.hero_header_btn} darkgray-button p-2`}
                  onClick={setAsActive}
                >
                  View Hotel
                </button>
              </div>              
              <div className='d-flex align-items-center'>
                <div>
                  <img src={profileimg} className='rounded-circle' />
                </div>
                <div className='mx-3 h-100 left-border-light-thin px-3'>
                  <p className={`${styles.hero_header_hotelname_text} p-0 m-0 mb-1`}>{hotelname}</p> 
                  <p className={`${styles.hero_header_hotelname_sub_text} p-0 m-0 text-capitalize`}>{state}, {country}</p>
                </div>
              </div>
            </div>


            <div className={`${styles.slider} py-3`}>
              {
                hotelRooms.length > 0
                ?
                  showHotelRooms
                :
                  <div className="w-100 py-3 my-3">
                    <ZeroItems zeroText="Zero rooms found" />
                  </div>
              }
              
            </div>            
        </Carousel.Item>
    )
  })

  return (
    <div>
        <div className={styles.container}>
            <div className={`${styles.todaygeneral} mb-4`}>
                <div className={styles.today}>CLASSICAL FEATURED HOTELS</div>
                <div className={styles.shortline}></div>
            </div>
            {/* <img src={mosque} alt="" className={styles.heroimage}/> */}
            <div>
              {
                allHotels.isLoading
                ?
                  <Loading loadingText={'loading hotels'} />
                :
                allHotels.errorMsg
                ?
                  <ServerFetchError errorMsg={allHotels.errorMsg} />
                :
                allHotels.data &&
                  <div className='d-flex justify-content-center'>
                    <Carousel
                      className='col-lg-12'
                      fade
                      interval={4000}
                      controls={false}
                    >
                      {
                        displayHotelsCarousel
                      }
                    </Carousel>
                  </div>
              }
            </div>
        </div>
    </div>
  )
}

export default Hero