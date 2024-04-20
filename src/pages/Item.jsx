import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findCombinations, findImages, findItem, findSameItems, orderItems } from "../http/itemApi";

import '../styles/item.scss'

import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { IoIosArrowUp } from 'react-icons/io'
import { MdPhotoCamera } from 'react-icons/md'

import sizes1 from '../assets/images/Sizes1.jpg'
import sizes2 from '../assets/images/Sizes2.png'
import { dealAdd } from "../http/bxApi";


const Item = () => {
    const { id, code } = useParams()
    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState()
    // eslint-disable-next-line
    const [same, setSame] = useState()
    const [images, setImages] = useState()
    const [count, setCount] = useState(1)
    const [tab, setTab] = useState('description')
    const [visible, setVisible] = useState(0)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')
    const [sendName, setSendName] = useState('')
    useEffect(() => {
        Promise.all([
            findItem(id),
            findSameItems(code),
            findImages(id),
            findCombinations(code)
        ]).then(([itemData, sameData, imagesData, combsData]) => {
            setItem(itemData)
            setSame(sameData)
            setImages(imagesData)
            // eslint-disable-next-line
            // eslint-disable-next-line
            // eslint-disable-next-line
            setLoading(false)
        })
        // eslint-disable-next-line
    }, [id])

    const countPlus = () => {
        setCount(count + 1)
    }

    const countMinus = () => {
        count > 1 && setCount(count - 1)
    }




    const slideLeft = () => {
        document.querySelector(`.Img${visible}`).classList.remove('Visible')
        document.querySelector(`.Dot${visible}`).classList.remove('Active')
        const amount = document.getElementsByClassName('SliderImage').length
        if (visible > 0) {
            document.querySelector(`.Img${visible - 1}`).classList.add('Visible')
            document.querySelector(`.Dot${visible - 1}`).classList.add('Active')
            setVisible(visible - 1)
        }
        if (visible === 0) {
            document.querySelector(`.Img${amount - 1}`).classList.add('Visible')
            document.querySelector(`.Dot${amount - 1}`).classList.add('Active')
            setVisible(amount - 1)
        }
    }

    const slideRight = () => {
        document.querySelector(`.Img${visible}`).classList.remove('Visible')
        document.querySelector(`.Dot${visible}`).classList.remove('Active')
        const amount = document.getElementsByClassName('SliderImage').length
        if (visible < amount - 1) {
            document.querySelector(`.Img${visible + 1}`).classList.add('Visible')
            document.querySelector(`.Dot${visible + 1}`).classList.add('Active')
            setVisible(visible + 1)
        }
        if (visible === amount - 1) {
            document.querySelector(`.Img${0}`).classList.add('Visible')
            document.querySelector(`.Dot${0}`).classList.add('Active')
            setVisible(0)
        }
    }

    const dotClick = (e, i) => {
        const all = document.getElementsByClassName('SliderImage')
        for (let k of all) {
            k.classList.remove('Visible')
        }
        const clicked = document.querySelector(`.Img${i}`)
        clicked.classList.add('Visible')
        const btns = document.getElementsByClassName('ImgDot')
        for (let k of btns) {
            k.classList.remove('Active')
        }
        e.target.classList.add('Active')
        setVisible(i)
    }
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

    const showModal = (e) => {
        if (e.target.classList.contains('BuyBtnActive')) {
            document.querySelector('.BuyModal').classList.remove('ModalNone')
        }
    }
    
    const tabClick = (e) => {
        const all = document.getElementsByClassName('InfoTab')
        for (let i of all) {
            i.classList.remove('InfoSelect')
        }
        e.target.classList.add('InfoSelect')
        setTab(e.target.id)
    }

    const closeModal = (e) => {
        if (!e.target.classList.contains('form')) {
            document.querySelector('.BuyModal').classList.add('ModalNone')
        }
    }

    const createDeal = () => {
        if (sendName.length > 0 && sendNumber.length === 11) {
            dealAdd(sendName, sendNumber, item.code, item.brand, item.name, item.grip, item.price, count, null, null, item.type)
            orderItems(item.id, count)
            document.querySelector('.BuyModal').classList.add('ModalNone')
        }
    }

    const imageLoad = (i) => {
        const none = document.querySelector(`.NoneImg${i}`)
        none && none.classList.add('None')
        const isImg = document.querySelector(`.IsImg${i}`)
        isImg && isImg.classList.remove('None')
    }

    return (
        <div className="ItemContainer">
            {!loading ?
                <>
                    {item ?
                        <>
                            <div className="ItemCard ItemCardOne">
                                <div className="ItemSlider">
                                    <div className="ImageContainer">
                                        {images.length > 0 ?
                                            <>
                                                {images.length > 1 &&
                                                    <div className="SliderBtn SlideLeft" onClick={slideLeft}><IoIosArrowUp className="SlLeft" size={30} /></div>
                                                }
                                                {images.map((image, i) => {
                                                    return (
                                                        <>
                                                            <div key={i} className={`SliderImage Img${i} ${i === 0 ? 'Visible' : ''}`}>
                                                                <img className={`IsImg${i} None`} src={`${process.env.REACT_APP_API_URL + image.img}`} onLoad={() => imageLoad(i)} alt="Фото товара" />
                                                                <div className={`ItemImg NoneImg NoneImg${i}`}>
                                                                    <div className="LoaderLight"></div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                                {images.length > 1 &&
                                                    <div className="SliderBtn SlideRight" onClick={slideRight}><IoIosArrowUp className="SlRight" size={30} /></div>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className="SliderImage Visible">
                                                    {item.img ?
                                                        <>
                                                            <img className="IsImg1 None" src={`${process.env.REACT_APP_API_URL + item.img}`} onLoad={() => imageLoad(1)} alt="Фото товара" />
                                                            <div className={`ItemImg NoneImg NoneImg1`}>
                                                                <div className="LoaderLight"></div>
                                                            </div>
                                                        </>
                                                        :
                                                        <div className="ItemImg NoneImg">
                                                            <div><MdPhotoCamera size={50} /></div>
                                                        </div>
                                                    }
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className="SliderDots">
                                        {images.map((image, i) => {
                                            return (
                                                <div key={i} className={`ImgDot Dot${i} ${i === 0 ? 'Active' : ''}`} onClick={(e) => dotClick(e, i)}></div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="ItemParams">
                                    <div className="ItemBrand">{item.brand}</div>
                                    <div className="ItemName">{item.name}</div>
                                    <div className="ItemCode">Арт. {item.code}</div>
                                    
                                    <div className="ItemPrice">{item.price} Р</div>
                                    <div className="ParamSub">КАТЕГОРИЯ</div>
                                    <div className="ItemBrand">{item.grip}</div>
                                    <div className="ParamsBtns">
                                        
                                    </div>
                                    
                                    <div className="ParamSub">Количество</div>
                                    <div className="ItemCount">
                                        <div className="CountBtn" onClick={countMinus}><AiOutlineMinus /></div>
                                        <div className="CountDigit">{count}</div>
                                        <div className="CountBtn" onClick={countPlus}><AiOutlinePlus /></div>
                                    </div>
                                    <div className={`ItemBuy ${'BuyBtnActive'}`} onClick={showModal}>КУПИТЬ</div>
                                </div>
                            </div>
                            <div className="ItemInfo">
                                <div className="InfoHeader">
                                    <div className="InfoTab InfoSelect" id="description" onClick={tabClick}>ОПИСАНИЕ</div>
                                    <div className="InfoTab" id="delivery" onClick={tabClick}>ДОСТАВКА</div>
                                </div>
                                <div className="InfoContent">
                                    {tab === 'description' ?
                                        <>
                                            <div className="InfoDesc">
                                                <div className="IDText">
                                                    <div className="InfoSub">{item.name}</div>
                                                    <div className="InfoText">
                                                        {item.description.split('\n').map((text, i) => {
                                                            return (
                                                                <span key={i}>{text}</span>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                {item.img &&
                                                    <div className="IDImg">
                                                        <img className="IsImgDesc None" src={`${process.env.REACT_APP_API_URL + item.img}`} onLoad={() => imageLoad('Desc')} alt="Фото клюшки" />
                                                        <div className={'ItemImg NoneImg NoneImgDesc'}>
                                                            <div className="LoaderLight"></div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </>
                                        :
                                        (tab === 'sizes') ?
                                            <>
                                                <div className="SizesImg">
                                                    <img src={sizes1} alt="Таблица размеров" />
                                                </div>
                                                <div className="SizesImg">
                                                    <img src={sizes2} alt="Таблица размеров" />
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="Ship">
                                                    <div className="ShipSub">ДОСТАВКА:</div>
                                                    <div className="ShipList">
                                                        <div className="ListItem">
                                                            • Доставка осуществляется курьерской службой СДЭК, в случаи отсутствия ПВЗ СДЭК в вашем населённом пункте, можем рассмотреть другие транспортные компании, такие как ПЭК и Деловые линии.
                                                        </div>
                                                        <div className="ListItem">
                                                            • Отправка осуществляется в течении 24 часов после оплаты заказы.
                                                        </div>
                                                        <div className="ListItem">
                                                            • После отправки мы направляем Вам номер транспортной накладной, для отслеживания заказа.
                                                        </div>
                                                        <div className="ListItem">
                                                            • Стоимость доставки оплачивается Вами при получении заказа.
                                                        </div>
                                                        <div className="ListItem">
                                                            • Узнать стоимость и срок доставки до Вашего населенного пункту, Вы сможете у менеджера при оформлении заказ.
                                                        </div>
                                                        <div className="ListItem">
                                                            • Оформление заказов доступно онлайн через выбор нужных товаров на сайте, по телефону, а так же в офисе г. Нижнекамск ул Спортивная, 14А
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="ShipSub SecondShipSub">САМОВЫВОЗ:</div>
                                                    <div className="ShipList">
                                                        <div className="ListItem">
                                                            Магазин "Выбор"
                                                        </div>
                                                        <div className="ListItem">
                                                            Адрес: г. Нижнекамск ул Спортивная, 14А
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <div className="ItemNotFound">Товар не найден</div>
                    }
                </>
                :
                <div className="LoaderContainer">
                    <div className="Loader"></div>
                </div>
            }
            {item &&
                <div className="BuyModal ModalNone" onClick={closeModal}>
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
                        <div className="BuyInfo form"><span className="form">Количество: </span>{count}</div>
                        <div className="BuyInfo BuyCost form">Стоимость: {item.price * count} Р</div>
                        <div className={`BuyConfirmBtn form ${sendNumber.length === 11 && sendName.length > 0 ? 'BuyConfirmActive' : ''}`} onClick={createDeal}>ОФОРМИТЬ ЗАКАЗ</div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Item;