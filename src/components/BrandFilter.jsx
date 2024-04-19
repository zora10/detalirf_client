import React, { useContext, useState } from "react";
import '../styles/brandFilter.scss'
import { observer } from "mobx-react-lite";
import { Context } from "..";

export const BrandFilter = observer(() => {
    const {catalogue} = useContext(Context)
    const [checked, setChecked] = useState([])

    const check = (brand) => {
        const checker = document.querySelector(`.Brand${brand}`)
        checker.classList.toggle('Checked')
        let newChecked = checked
        if (checker.classList.contains('Checked')) {
            newChecked.push(brand)
        } else {
            newChecked = checked.filter(item => item !== brand)
        }
        setChecked(newChecked)
        catalogue.setBrandsSet(newChecked)
    }

    return (
        <div className="BrandFilter Invisible">
            {catalogue.brands.map((brand, i) => {
                return (
                    <div key={i} id={brand} className="BrandChecker" onClick={() => check(brand)}>
                        <div id={brand} className={`BrandCheckBox Brand${brand}`}></div>
                        <div id={brand}>{brand}</div>
                    </div>
                )
            })}
        </div>
    );
})
 
export default BrandFilter;