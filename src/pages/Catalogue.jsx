import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";

import { IoIosArrowUp } from 'react-icons/io'
import { MdPhotoCamera } from 'react-icons/md'
import edit from '../assets/icons/edit.png'

import '../styles/catalogue.scss'
import PriceFilter from "../components/PriceFilter";
import BrandFilter from "../components/BrandFilter";
import GripFilter from "../components/GripFilter";
import BendFilter from "../components/BendFilter";
import RigidityFilter from "../components/RigidityFilter";
import { fetchBends, fetchBrands, fetchGrips, fetchItems, fetchMax, fetchRigidities, orderItems } from "../http/itemApi";
import { useNavigate } from "react-router-dom";
import { dealAdd } from "../http/bxApi";

export const Catalogue = observer(({ type }) => {
    const navigate = useNavigate()
    const { catalogue } = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [itemsLoading, setItemsLoading] = useState(false)
    const [pages, setPages] = useState(0)

    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')
    const [sendName, setSendName] = useState('')
    const [item, setItem] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        Promise.all([
            await fetchMax(),
            await fetchBrands(),
            await fetchGrips(),
            await fetchBends(),
            await fetchRigidities(),
        ]).then(async ([maxData, brandsData, gripsData, bendsData, rigiditiesData]) => {
            catalogue.setMax(maxData)
            catalogue.setBrands(brandsData)
            catalogue.setGrips(gripsData)
            catalogue.setBends(bendsData)
            catalogue.setRigidities(rigiditiesData)

            await fetchItems(catalogue.brands, catalogue.grips, catalogue.bends, catalogue.rigidities, type, catalogue.min, catalogue.max, catalogue.limit, catalogue.page).then((data) => {
                if (data) {
                    catalogue.setItems(data)
                    setPages(Math.ceil(data.count / catalogue.limit))
                }
                setLoading(false)
            })
        })
    }

    const fetchFilteredData = () => {
        setItemsLoading(true)
        fetchItems(
            catalogue.brandsSet.length > 0 ? catalogue.brandsSet : catalogue.brands,
            catalogue.gripsSet.length > 0 ? catalogue.gripsSet : catalogue.grips,
            catalogue.bendsSet.length > 0 ? catalogue.bendsSet : catalogue.bends,
            catalogue.rigiditiesSet.length > 0 ? catalogue.rigiditiesSet : catalogue.rigidities,
            type,
            catalogue.minSet,
            catalogue.maxSet,
            catalogue.limit,
            catalogue.page
        ).then((data) => {
            if (data) {
                catalogue.setItems(data)
            }
            setItemsLoading(false)
        })
    }

    const imageLoad = (i) => {
        const none = document.querySelector(`.NoneImg${i}`)
        none && none.classList.add('None')
        const isImg = document.querySelector(`.IsImg${i}`)
        isImg && isImg.classList.remove('None')
    }

    const setPrice = () => {
        document.querySelector('.PriceFilter').classList.toggle('Invisible')
        document.querySelector('.PriceArr').classList.toggle('Down')
    }

    const setBrand = () => {
        document.querySelector('.BrandFilter').classList.toggle('Invisible')
        document.querySelector('.BrandArr').classList.toggle('Down')
    }

    const setGrip = () => {
        document.querySelector('.GripFilter').classList.toggle('Invisible')
        document.querySelector('.GripArr').classList.toggle('Down')
    }

    const setBend = () => {
        document.querySelector('.BendFilter').classList.toggle('Invisible')
        document.querySelector('.BendArr').classList.toggle('Down')
    }

    const setRigidity = () => {
        document.querySelector('.RigidityFilter').classList.toggle('Invisible')
        document.querySelector('.RigidityArr').classList.toggle('Down')
    }

    const showFilter = () => {
        document.querySelector('.FiltersMobile').classList.toggle('FiltersNone')
        document.querySelector('.FilterArr').classList.toggle('Down')
    }

    useEffect(() => {
        try {
            fetchData()
        } catch (e) {

        }
        // eslint-disable-next-line
    }, [type])

    const handleNavigate = (item) => {
        const links = document.getElementsByClassName('HType')
        for (let i of links) {
            i.classList.remove('Lined')
        }
        if (item.id)
            navigate(`/item/${item.id}/${item.code}`)
        else
            navigate(`/item/${item.ids[0]}/${item.code}`)
    }

    let first = 1,
        last = pages,
        thisP = catalogue.page,
        nextP = catalogue.page + 1,
        prevP = catalogue.page - 1

    const handlePagination = (e) => {
        const thisE = document.getElementById(`${e.target.id}`)
        const hide_1_2 = document.querySelector('.Hide-1-2')
        const hide_29_30 = document.querySelector('.Hide-29-30')
        const buttons = document.getElementsByClassName('E-pag')
        for (let i of buttons) {
            i.classList.remove('E-this')
        }

        switch (e.target.id) {
            case 'left':
                if (prevP !== 0) {
                    thisP--
                    nextP--
                    prevP--
                }
                break

            case 'right':
                if (nextP !== last + 1) {
                    thisP++
                    prevP++
                    nextP++
                }
                break

            case 'first':
                thisP = first
                nextP = first + 1
                prevP = first - 1
                break

            case 'mid1':
                thisP = Number(thisE.innerText)
                nextP = thisP + 1
                prevP = thisP - 1
                break

            case 'mid2':
                thisP = Number(thisE.innerText)
                nextP = thisP + 1
                prevP = thisP - 1
                break

            case 'mid3':
                thisP = Number(thisE.innerText)
                nextP = thisP + 1
                prevP = thisP - 1
                break

            case 'last':
                thisP = last
                prevP = last - 1
                nextP = last + 1
                break

            default:
                break
        }

        catalogue.setPage(Number(thisP))
        fetchFilteredData()

        if (last > 5) {
            switch (thisP) {
                case 1:
                    hide_1_2.classList.add('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.add('E-inactive')
                    buttons[1].classList.add('E-this')
                    buttons[2].innerText = '2'
                    buttons[3].innerText = '3'
                    buttons[4].innerText = '4'
                    buttons[6].classList.remove('E-inactive')
                    break

                case last:
                    hide_29_30.classList.add('Removed')
                    hide_1_2.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${last - 3}`
                    buttons[3].innerText = `${last - 2}`
                    buttons[4].innerText = `${last - 1}`
                    buttons[5].classList.add('E-this')
                    buttons[6].classList.add('E-inactive')
                    break

                case 2:
                    hide_1_2.classList.add('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].classList.add('E-this')
                    buttons[2].innerText = '2'
                    buttons[3].innerText = '3'
                    buttons[4].innerText = '4'
                    buttons[6].classList.remove('E-inactive')
                    break

                case last - 1:
                    hide_29_30.classList.add('Removed')
                    hide_1_2.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${last - 3}`
                    buttons[3].innerText = `${last - 2}`
                    buttons[4].innerText = `${last - 1}`
                    buttons[4].classList.add('E-this')
                    buttons[6].classList.remove('E-inactive')
                    break

                case 3:
                    hide_1_2.classList.add('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${prevP}`
                    buttons[3].classList.add('E-this')
                    buttons[3].innerText = `${thisP}`
                    buttons[4].innerText = `${nextP}`
                    buttons[6].classList.remove('E-inactive')
                    break

                case last - 2:
                    hide_1_2.classList.remove('Removed')
                    hide_29_30.classList.add('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${prevP}`
                    buttons[3].classList.add('E-this')
                    buttons[3].innerText = `${thisP}`
                    buttons[4].innerText = `${nextP}`
                    buttons[6].classList.remove('E-inactive')
                    break

                default:
                    hide_1_2.classList.remove('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${prevP}`
                    buttons[3].classList.add('E-this')
                    buttons[3].innerText = `${thisP}`
                    buttons[4].innerText = `${nextP}`
                    buttons[6].classList.remove('E-inactive')
                    break
            }
        } else {
            switch (thisP) {
                case 1:
                    buttons[0].classList.add('E-inactive')
                    buttons[1].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                case last:
                    buttons[0].classList.remove('E-inactive')
                    buttons[last].classList.add('E-this')
                    buttons[last + 1].classList.add('E-inactive')
                    break

                case 2:
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                case 3:
                    buttons[0].classList.remove('E-inactive')
                    buttons[3].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                case 4:
                    buttons[0].classList.remove('E-inactive')
                    buttons[4].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                default:
                    break
            }
        }
    }

    useEffect(() => {
        try {
            const hide_1_2 = document.querySelector('.Hide-1-2')
            const hide_29_30 = document.querySelector('.Hide-29-30')
            const buttons = document.getElementsByClassName('E-pag')
            for (let i of buttons) {
                i.classList.remove('E-this')
            }

            if (last > 5) {
                switch (thisP) {
                    case 1:
                        hide_1_2.classList.add('Removed')
                        hide_29_30.classList.remove('Removed')
                        buttons[0].classList.add('E-inactive')
                        buttons[1].classList.add('E-this')
                        buttons[2].innerText = '2'
                        buttons[3].innerText = '3'
                        buttons[4].innerText = '4'
                        buttons[6].classList.remove('E-inactive')
                        break

                    case last:
                        hide_29_30.classList.add('Removed')
                        hide_1_2.classList.remove('Removed')
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].innerText = `${last - 3}`
                        buttons[3].innerText = `${last - 2}`
                        buttons[4].innerText = `${last - 1}`
                        buttons[5].classList.add('E-this')
                        buttons[6].classList.add('E-inactive')
                        break

                    case 2:
                        hide_1_2.classList.add('Removed')
                        hide_29_30.classList.remove('Removed')
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].classList.add('E-this')
                        buttons[2].innerText = '2'
                        buttons[3].innerText = '3'
                        buttons[4].innerText = '4'
                        buttons[6].classList.remove('E-inactive')
                        break

                    case last - 1:
                        hide_29_30.classList.add('Removed')
                        hide_1_2.classList.remove('Removed')
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].innerText = `${last - 3}`
                        buttons[3].innerText = `${last - 2}`
                        buttons[4].innerText = `${last - 1}`
                        buttons[4].classList.add('E-this')
                        buttons[6].classList.remove('E-inactive')
                        break

                    case 3:
                        hide_1_2.classList.add('Removed')
                        hide_29_30.classList.remove('Removed')
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].innerText = `${prevP}`
                        buttons[3].classList.add('E-this')
                        buttons[3].innerText = `${thisP}`
                        buttons[4].innerText = `${nextP}`
                        buttons[6].classList.remove('E-inactive')
                        break

                    case last - 2:
                        hide_1_2.classList.remove('Removed')
                        hide_29_30.classList.add('Removed')
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].innerText = `${prevP}`
                        buttons[3].classList.add('E-this')
                        buttons[3].innerText = `${thisP}`
                        buttons[4].innerText = `${nextP}`
                        buttons[6].classList.remove('E-inactive')
                        break

                    default:
                        hide_1_2.classList.remove('Removed')
                        hide_29_30.classList.remove('Removed')
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].innerText = `${prevP}`
                        buttons[3].classList.add('E-this')
                        buttons[3].innerText = `${thisP}`
                        buttons[4].innerText = `${nextP}`
                        buttons[6].classList.remove('E-inactive')
                        break
                }
            } else {
                switch (thisP) {
                    case 1:
                        buttons[0].classList.add('E-inactive')
                        buttons[1].classList.add('E-this')
                        buttons[last + 1].classList.remove('E-inactive')
                        break

                    case last:
                        buttons[0].classList.remove('E-inactive')
                        buttons[last].classList.add('E-this')
                        buttons[last + 1].classList.add('E-inactive')
                        break

                    case 2:
                        buttons[0].classList.remove('E-inactive')
                        buttons[2].classList.add('E-this')
                        buttons[last + 1].classList.remove('E-inactive')
                        break

                    case 3:
                        buttons[0].classList.remove('E-inactive')
                        buttons[3].classList.add('E-this')
                        buttons[last + 1].classList.remove('E-inactive')
                        break

                    case 4:
                        buttons[0].classList.remove('E-inactive')
                        buttons[4].classList.add('E-this')
                        buttons[last + 1].classList.remove('E-inactive')
                        break

                    default:
                        break
                }
            }
        } catch (e) {

        }
    }, [catalogue, thisP, last, nextP, prevP])

    useEffect(() => {
        catalogue.setPage(1)
        fetchFilteredData()
        // eslint-disable-next-line
    }, [type])

    const handleBackspace = (e) => {
        if (e.keyCode === 8 || e.key === 'Backspace') {
            e.preventDefault()
            const cleaned = ('' + e.target.value).replace(/\D/g, '')
            const match = cleaned.split('')
            let formattedNumber
            switch (cleaned.length) {
                case 10:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-${match[8]}`
                    break
                case 9:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-`
                    break
                case 8:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}`
                    break
                case 7:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-`
                    break
                case 6:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}`
                    break
                case 5:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}`
                    break
                case 4:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) `
                    break
                case 3:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}`
                    break
                case 2:
                    formattedNumber = !match ? '' :
                        `(${match[0]}`
                    break
                case 1:
                    formattedNumber = !match ? '' : ``
                    break
                case 0:
                    formattedNumber = !match ? '' : ``
                    break

                default:
                    break
            }
            const newCleaned = ('7' + formattedNumber).replace(/\D/g, '')
            setPhoneNumber(formattedNumber)
            setSendNumber(newCleaned)
        }
    }

    const handlePhoneChange = (e) => {
        const formattedNumber = formatPhoneNumber(e)
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        setPhoneNumber(formattedNumber)
        setSendNumber('7' + cleaned)
    }

    const formatPhoneNumber = (e) => {
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        setSendNumber('7' + cleaned)
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
        let formattedNumber
        switch (cleaned.length) {
            case 10:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 9:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 8:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-`
                break
            case 7:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}`
                break
            case 6:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-`
                break
            case 5:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 4:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 3:
                formattedNumber = !match ? '' : `(${match[1]}) `
                break
            case 2:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 1:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 0:
                formattedNumber = !match ? '' : ``
                break

            default:
                break
        }

        return formattedNumber;
    }

    const closeModal = (e) => {
        if (!e.target.classList.contains('form')) {
            setItem(null)
        }
    }

    const createDeal = () => {
        if (sendName.length > 0 && sendNumber.length === 11) {
            dealAdd(sendName, sendNumber, item.code, item.brand, item.name, item.grip, item.bend, item.rigidity, item.price, 1, item.renew, item.height, item.type)
            orderItems(item.id, 1)
            setItem(null)
        }
    }

    return (
        <div className="Catalogue">
            {!loading ?
                <>
                    <div className="FiltersBox ShowFilter" onClick={showFilter}>
                        <img src={edit} alt="Фильтры" />
                        <span>ФИЛЬТРЫ</span>
                        <IoIosArrowUp className="FilterArr Down" />
                    </div>
                    <div className="FilterLine ShowFilter"></div>
                    <div className="FiltersBox FiltersMobile FiltersNone">
                        <div className="Filter">
                            <div className="FSub">ТОВАРЫ</div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setPrice}>ФИЛЬТР ПО ЦЕНЕ <IoIosArrowUp className="Arrow PriceArr Down" /></div>
                                <PriceFilter min={0} max={catalogue.max} />
                            </div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setBrand}>БРЕНД <IoIosArrowUp className="Arrow BrandArr Down" /></div>
                                <BrandFilter className="brandFilter" />
                            </div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setGrip}>КАТЕГОРИЯ <IoIosArrowUp className="Arrow GripArr Down" /></div>
                                <GripFilter className="gripFilter" />
                            </div>
                            
                            
                        </div>
                        <div className="FilterFetch" onClick={fetchFilteredData}>ПОКАЗАТЬ</div>
                        <div className="FilterBreak" onClick={fetchData}>СБРОСИТЬ</div>
                    </div>
                    {type !== 'restored' ?
                        <div className="ItemsBox">
                            {!itemsLoading ?
                                <>
                                    {catalogue.items.length > 0 && catalogue.items[0].ids ?
                                        <div className="ItemsBoxShow">
                                            {[...new Set(catalogue.items.map(item => item.code))].map((uniqueCode, i) => {
                                                const uniqueItem = catalogue.items.find(item => item.code === uniqueCode)
                                                
                                                if (uniqueItem) {
                                                        return (
                                                            <div key={i} className="ItemCard ItemCardMain">
                                                                {uniqueItem.imgs[0] ?
                                                                    <>
                                                                        <div className={`ItemImg None IsImg${i}`}>
                                                                            <img src={`${process.env.REACT_APP_API_URL + uniqueItem.imgs[0]}`} alt="Фото клюшки" onLoad={() => imageLoad(i)} onClick={() => handleNavigate(uniqueItem)} />
                                                                            <div className="ItemClick" id={uniqueItem.ids[0]} onClick={() => handleNavigate(uniqueItem)}>
                                                                                <div className="ItemShow" id={uniqueItem.ids[0]} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`ItemImg NoneImg NoneImg${i}`} id={`${i}noneimg`} onClick={() => handleNavigate(uniqueItem)}>
                                                                            <div className="LoaderMid"></div>
                                                                            <div className="ItemClick" id={uniqueItem.ids[0]} onClick={() => handleNavigate(uniqueItem)}>
                                                                                <div className="ItemShow" id={uniqueItem.ids[0]} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <div className="ItemImg NoneImg" onClick={() => handleNavigate(uniqueItem)}>
                                                                        <div><MdPhotoCamera size={50} /></div>
                                                                        <div className="ItemClick" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>
                                                                            <div className="ItemShow" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="ItemInfo">
                                                                    <div className="ItemBrand">{uniqueItem.brands[0]}</div>
                                                                    <div className="ItemName">{uniqueItem.names[0]}</div>
                                                                    <div className="ItemPrice">{uniqueItem.prices[0]} Р</div>
                                                                </div>
                                                            </div>
                                                        )
                                                } else return null
                                            })}
                                        </div>
                                        :
                                        <div className="NothingFound">Ничего не найдено</div>
                                    }
                                </>
                                :
                                <div className="LoaderContainer">
                                    <div className="Loader"></div>
                                </div>
                            }
                            {pages > 5 ?
                                <div className="E-pagination">
                                    <button id="left" className="E-pag E-left E-margin-0 E-inactive" onClick={handlePagination}>➔</button>
                                    <button id="first" className="E-pag E-this" onClick={handlePagination}>1</button>
                                    <div className="Hide-1-2 Removed">. . .</div>
                                    <button id="mid1" className="E-pag E-mid-1" onClick={handlePagination}>2</button>
                                    <button id="mid2" className="E-pag" onClick={handlePagination}>3</button>
                                    <button id="mid3" className="E-pag E-mid-3" onClick={handlePagination}>4</button>
                                    <div className="Hide-29-30">. . .</div>
                                    <button id="last" className="E-pag E-last" onClick={handlePagination}>{pages}</button>
                                    <button id="right" className="E-pag" onClick={handlePagination}>➔</button>
                                </div>
                                : (pages > 1) &&
                                <div className="E-pagination">
                                    <button id="left" className="E-pag E-left E-margin-0 E-inactive" onClick={handlePagination}>➔</button>
                                    <button id="first" className="E-pag E-this" onClick={handlePagination}>1</button>
                                    <button id="mid1" className="E-pag E-mid-1" onClick={handlePagination}>2</button>
                                    {pages > 2 &&
                                        <button id="mid2" className="E-pag" onClick={handlePagination}>3</button>
                                    }
                                    {pages > 3 &&
                                        <button id="mid3" className="E-pag E-mid-3" onClick={handlePagination}>4</button>
                                    }
                                    {pages > 4 &&
                                        <button id="last" className="E-pag E-last" onClick={handlePagination}>5</button>
                                    }
                                    <button id="right" className="E-pag" onClick={handlePagination}>➔</button>
                                </div>
                            }
                        </div>
                        :
                        <div className="RestoredItemsBox">
                            {!itemsLoading ?
                                <>
                                    {catalogue.items.length > 0 ?
                                        <>
                                            <div className="TableClue">Листать вправо →</div>
                                            <div className="TableWrap2">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <th>Фирма</th>
                                                            <th>Название</th>
                                                            <th>Хват</th>
                                                            <th>Загиб</th>
                                                            <th>Жесткость</th>
                                                            <th>Высота</th>
                                                            <th>Ремонт</th>
                                                            <th>Цена</th>
                                                            <th>Купить</th>
                                                        </tr>
                                                        {catalogue.items.map((item, i) => {
                                                            if (item.count > 0) {
                                                                return (
                                                                    <tr key={i}>
                                                                        {item.count > 0 &&
                                                                            <>
                                                                                <td>{item.brand}</td>
                                                                                <td className="ItemName">
                                                                                    <span>{item.name}</span>
                                                                                    <span className="Code">Арт. {item.code}</span>
                                                                                </td>
                                                                                <td>{item.grip}</td>
                                                                                <td>{item.bend}</td>
                                                                                <td>{item.rigidity}</td>
                                                                                <td>{item.height}</td>
                                                                                <td>{item.renew}</td>
                                                                                <td className="ItemPrice">{item.price} Р</td>
                                                                                <td className="ItemBuy"><div onClick={() => setItem(item)}>Купить</div></td>
                                                                            </>
                                                                        }
                                                                    </tr>
                                                                )
                                                            } else return null
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                        :
                                        <div className="NothingFound">Ничего не найдено</div>
                                    }
                                </>
                                :
                                <div className="LoaderContainer">
                                    <div className="Loader"></div>
                                </div>
                            }
                        </div>
                    }
                </>
                :
                <div className="LoaderContainer">
                    <div className="Loader"></div>
                </div>
            }
            {item &&
                <div className="BuyModal" onClick={closeModal}>
                    <div className="BuyForm form">
                        <div className="BuySub form">Оформление заказа</div>
                        <div className="BuyClue form">Имя</div>
                        <input className="InputName form" type="text" placeholder="Имя" value={sendName} onChange={(e) => setSendName(e.target.value)} />
                        <div className="BuyClue form">Номер телефона</div>
                        <div className="InputContainer form">
                            <span className="PreNum form">+7&nbsp;</span>
                            <input
                                className="InputNumber form"
                                type="text"
                                maxLength="15"
                                value={phoneNumber}
                                onChange={(e) => {
                                    handlePhoneChange(e)
                                }}
                                onKeyDown={handleBackspace}
                                placeholder="(999) 999-99-99"
                            />
                        </div>
                        <div className="BuyClue form">Информация о заказе</div>
                        <div className="BuyInfo form"><span className="form">Артикул: </span>{item.code}</div>
                        <div className="BuyInfo form"><span className="form">Фирма: </span>{item.brand}</div>
                        <div className="BuyInfo form"><span className="form">Название: </span>{item.name}</div>
                        <div className="BuyInfo form"><span className="form">Категория: </span>{item.grip}</div>
                        <div className="BuyInfo form"><span className="form">Цена: </span>{item.price} Р</div>
                        <div className="BuyInfo BuyCost form">Стоимость: {item.price} Р</div>
                        <div className={`BuyConfirmBtn form ${sendNumber.length === 11 && sendName.length > 0 ? 'BuyConfirmActive' : ''}`} onClick={createDeal}>ОФОРМИТЬ ЗАКАЗ</div>
                    </div>
                </div>
            }
        </div>
    );
})

export default Catalogue;