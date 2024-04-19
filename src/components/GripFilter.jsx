import React, { useContext, useState } from "react";
import '../styles/gripFilter.scss'
import { observer } from "mobx-react-lite";
import { Context } from "..";

export const GripFilter = observer(() => {
    const {catalogue} = useContext(Context)
    const [checked, setChecked] = useState([])

    const check = (grip) => {
        const checker = document.querySelector(`.Grip${grip}`)
        checker.classList.toggle('Checked')
        let newChecked = checked
        if (checker.classList.contains('Checked')) {
            newChecked.push(grip)
        } else {
            newChecked = checked.filter(item => item !== grip)
        }
        setChecked(newChecked)
        catalogue.setGripsSet(newChecked)
    }

    return (
        <div className="GripFilter Invisible">
            {catalogue.grips.map((grip, i) => {
                return (
                    <div key={i} id={grip} className="GripChecker" onClick={() => check(grip)}>
                        <div id={grip} className={`GripCheckBox Grip${grip}`}></div>
                        <div id={grip}>{grip}</div>
                    </div>
                )
            })}
        </div>
    );
})
 
export default GripFilter;