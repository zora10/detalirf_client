import React, { useContext, useEffect, useState } from 'react';
import Slider from 'react-slider'

import '../styles/priceFilter.scss'
import { Context } from '..';

const PriceFilter = ({min, max}) => {
    const {catalogue} = useContext(Context)
    const [values, setValues] = useState([min, max])

    useEffect(() => {
        let leftTrack = document.createElement('div')
        let rightTrack = document.createElement('div')
        leftTrack.classList.add('LeftTrack')
        rightTrack.classList.add('RightTrack')
        const slider = document.querySelector('.slider')
        slider.appendChild(leftTrack)
        slider.appendChild(rightTrack)
    }, [])

    useEffect(() => {
        const leftTrack = document.querySelector('.LeftTrack')
        const rightTrack = document.querySelector('.RightTrack')
        leftTrack && leftTrack.setAttribute('style', `width: calc(100% * ${values[0]} / ${max})`)
        rightTrack && rightTrack.setAttribute('style', `width: calc(100% * ${max - values[1]} / ${max})`)
        catalogue.setMaxSet(values[1])
        catalogue.setMinSet(values[0])
    }, [values, max, catalogue])

    return (
        <div className='SliderContainer FilterContainer PriceFilter Invisible'>
            <Slider 
                className='slider' 
                value={values} 
                min={min} 
                max={max} 
                onChange={setValues}
            />
            <div className='PriceValues'>{values[0]} - {values[1]} Р</div>
        </div>
    );
};

export default PriceFilter;