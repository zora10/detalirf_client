import React, { useContext, useState } from "react";
import '../styles/rigidityFilter.scss'
import { Context } from "..";

const RigidityFilter = () => {
    const {catalogue} = useContext(Context)
    const [checked, setChecked] = useState([])

    const check = (rigidity) => {
        const checker = document.querySelector(`.Rig${rigidity}`)
        checker.classList.toggle('Checked')
        let newChecked = checked
        if (checker.classList.contains('Checked')) {
            newChecked.push(rigidity)
        } else {
            newChecked = checked.filter(item => item !== rigidity)
        }
        setChecked(newChecked)
        catalogue.setRigiditiesSet(newChecked)
    }

    return (
        <div className="RigidityFilter Invisible">
            {catalogue.rigidities.map((rigidity, i) => {
                return (
                    <div key={i} id={rigidity} className="RigidityChecker" onClick={() => check(rigidity)}>
                        <div id={rigidity} className={`RigidityCheckBox Rig${rigidity}`}></div>
                        <div id={rigidity}>{rigidity}</div>
                    </div>
                )
            })}
        </div>
    );
}
 
export default RigidityFilter;