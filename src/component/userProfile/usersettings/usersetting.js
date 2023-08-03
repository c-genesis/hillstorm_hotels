import React from 'react'
import Styles from '../usersettings/usersetting.module.css'
import Settingproperties from '../settingproperties/settingproperties'

function Usersetting({ user_CP, setUser_CP }) {
  return (
    <div>
        <div className={Styles.settingsection}>
            <Settingproperties 
              user_CP={user_CP}
              setUser_CP={setUser_CP}
            />
        </div>
    </div>
  )
}

export default Usersetting