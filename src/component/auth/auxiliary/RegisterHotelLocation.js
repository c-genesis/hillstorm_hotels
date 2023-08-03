import { ErrorMessage, Formik } from 'formik'
import React from 'react'
import { NIGERIAN_STATES_AND_CITIES } from '../../globals/globals'
import * as yup from 'yup'



export default function RegisterHotelLocation({ setHotelLocationInfo }){

    const schema = yup.object({
        state: yup.string().required('State is required'),
        city: yup.string().required('City is required'),
        address: yup.string().required('Address is required')
    })
    
    const displayCities = ({ state }) => 
        NIGERIAN_STATES_AND_CITIES.filter(nigerianState => nigerianState.state.toLowerCase() == state.toLowerCase())
            [0].cities.map((city, i) => (
                <option key={i} value={city}>{city}</option>
            ))

    const displayStates = NIGERIAN_STATES_AND_CITIES.map((nigerianState, i) => {
        const { state } = nigerianState
        return (
            <option key={i} value={state}>{state}</option>
        )
    })
    
    return(
        <div>
            <Formik
                initialValues={{
                    state: '', city: '', address: ''
                }}
                validationSchema={schema}
                onSubmit={(values, resetForm) => {
                    setHotelLocationInfo(values)
                    resetForm()
                }}
            >
                {({ values, dirty, isValid, handleChange, handleBlur, handleSubmit }) => (
                    <div>
                        <div className='mb-2 border-bottom pb-2'>
                            <h6 className='login-form-label left-border px-2 mb-3'>Be advised: </h6>
                            <h6 className='login-form-label'> 
                                Only Hotels with Nigerian addresses can register. 
                                We are working on expanding to other contries in due time
                            </h6>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="state" className="login-form-label mb-2">State</label>
                            <br/>
                            <select
                                className="login-form-input-field p-2 w-100"
                                name='state'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.state}
                                onInput={() => {
                                    values.city = ''
                                    values.address = ''
                                    return
                                }}
                            >
                                <option value='' style={{backgroundColor: '#D9D9D9'}}>Select state</option>
                                {displayStates}
                            </select>
                            <p className="login-error-msg text-center my-2">
                                <ErrorMessage name="state" />
                            </p>
                        </div>
                        {
                            values.state &&
                                <div>
                                    <div className="mb-4">
                                        <label htmlFor="city" className="login-form-label mb-2">City</label>
                                        <br/>
                                        <select
                                            className="login-form-input-field p-2 w-100"
                                            name='city'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.city}
                                        >
                                            <option value='' style={{opacity: 0.66}}>Select city</option>
                                            {displayCities({ state: values.state })}
                                        </select>
                                        <p className="login-error-msg text-center my-2">
                                            <ErrorMessage name="city" />
                                        </p>
                                    </div>  

                                    <div className="mb-4">
                                        <label htmlFor="address" className="login-form-label mb-2">Address</label>
                                        <br/>
                                        <textarea 
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder='An explicit address that describes the exact location of your hotel. The more precise it is, the better...'
                                            className="login-form-input-field p-2 w-100"                                            
                                            style={{
                                                height: '25vh'
                                            }}
                                        />                                        
                                        <p className="login-error-msg text-center my-2">
                                            <ErrorMessage name="address" />
                                        </p>
                                    </div>   

                                    <div className="mb-3">
                                        <button 
                                            disabled={!(isValid && dirty)}
                                            style={{
                                                opacity: !(isValid && dirty) ? 0.56 : 1
                                            }}
                                            onClick={handleSubmit}
                                            type="submit"
                                            className="login-form-btn w-100 p-3"
                                        >
                                            Continue...
                                        </button>
                                    </div>                                                                     
                                </div>                                  
                        }                                                 
                    </div>
                )}
            </Formik>
        </div>
    )
}