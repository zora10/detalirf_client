import React, { useContext, useState } from "react";
import '../styles/bendFilter.scss'
import { Context } from "..";

const BendFilter = () => {
    const {catalogue} = useContext(Context)
    const [checked, setChecked] = useState([])

    const check = (bend) => {
        const checker = document.querySelector(`.Bend${bend}`)
        checker.classList.toggle('Checked')
        let newChecked = checked
        if (checker.classList.contains('Checked')) {
            newChecked.push(bend)
        } else {
            newChecked = checked.filter(item => item !== bend)
        }
        setChecked(newChecked)
        catalogue.setBendsSet(newChecked)
    }

    return (
        <div className="BendFilter Invisible">
            {catalogue.bends.map((bend, i) => {
                return (
                    <div key={i} id={bend} className="BendChecker" onClick={() => check(bend)}>
                        <div id={bend} className={`BendCheckBox Bend${bend}`}></div>
                        <div id={bend}>{bend}</div>
                    </div>
                )
            })}
        </div>
    );
}
 
export default BendFilter;