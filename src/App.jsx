import AppRoutes from "./AppRoutes";
import './styles/app.scss'
import './styles/base.scss'
import logo from './assets/images/Logo.png'
import logo2 from './assets/images/Logo2.png'
import vk from './assets/icons/vk.png'
import tg from './assets/icons/tg.png'
import gis from './assets/icons/gis.jpeg'
import yandex from './assets/icons/yandex.png'
import form from './assets/images/form.jpg'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { callAdd, formAdd } from "./http/bxApi";
import { IoIosCloseCircle } from 'react-icons/io'

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentUrl = location.pathname
    const [type, setType] = useState('original')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')
    const [sendName, setSendName] = useState('')
    const [sendNumber2, setSendNumber2] = useState('')
    const [phoneNumber2, setPhoneNumber2] = useState('')

    const chooseType = (e) => {
        setType(e.target.id)
        const links = document.getElementsByClassName('HType')
        for (let i of links) {
            i.classList.remove('Lined')
        }
        e.target.classList.add('Lined')
        navigate('/')
    }

    useEffect(() => {
        if (currentUrl === '/admin/' || currentUrl === '/admin') {
            setType('')
            const links = document.getElementsByClassName('HType')
            for (let i of links) {
                i.classList.remove('Lined')
            }
        } else {
            if (!currentUrl.includes('item'))
                document.getElementById(`${type}`).classList.add('Lined')
        }
    }, [currentUrl, type])

    const isAdmin = () => {
        return currentUrl === '/admin/' || currentUrl === '/admin'
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
            if (e.target.id !== 'num2') {
                setPhoneNumber(formattedNumber)
                setSendNumber(newCleaned)
            } else {
                setPhoneNumber2(formattedNumber)
                setSendNumber2(newCleaned)
            }
        }
    }

    const handlePhoneChange = (e) => {
        const formattedNumber = formatPhoneNumber(e)
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        if (e.target.id !== 'num2') {
            setPhoneNumber(formattedNumber)
            setSendNumber('7' + cleaned)
        } else {
            setPhoneNumber2(formattedNumber)
            setSendNumber2('7' + cleaned)
        }
    }

    const formatPhoneNumber = (e) => {
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        if (e.target.id !== 'num2') {
            setSendNumber('7' + cleaned)
        } else {
            setSendNumber2('7' + cleaned)
        }
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

    const sendCall = () => {
        if (sendName.length > 0 && sendNumber.length === 11) {
            callAdd(sendName, sendNumber)
            setSendName('')
            setSendNumber('')
            setPhoneNumber('')
        }
    }

    const closeForm = (e) => {
        const box = document.querySelector('.MinuteForm')
        if (!e.target.classList.contains('form'))
            box && box.classList.add('None')
    }

    const sendForm = () => {
        if (sendNumber2.length === 11) {
            formAdd(sendNumber2)
            setSendNumber2('')
            setPhoneNumber2('')
            document.querySelector('.MinuteForm').classList.add('None')
        }
    }

    useEffect(() => {
        let date = new Date()
        date = date.getDay() + ' ' + date.getMonth()
        console.log(date)
        if (date !== localStorage.getItem('formcheck') && currentUrl !== '/admin/' && currentUrl !== '/admin') {
            setTimeout(() => {
                document.querySelector('.MinuteForm').classList.remove('None')
            }, 90000)
        }
        localStorage.setItem('formcheck', date)
    }, [currentUrl])

    return (
        <div className="App">
            <header className="Header">
                <div className="HeaderTop">
                    <img src={logo} alt="Логотип" />
                </div>
                {!isAdmin() ?
                    <div className="HeaderBottom">
                        <div className="HeaderTypes">
                            <div className="HType Lined" id="original" onClick={chooseType}>КАТАЛОГ ТОВАРОВ</div>
                        </div>
                    </div>
                    :
                    <></>
                }
            </header>
            <section className="Content">
                <AppRoutes type={type} />
            </section>
            <footer className="Footer">
                <div className="FooterTop">
                    <div className="FWrap1">
                        <div className="FLogo"><img src={logo2} alt="Логотип" /></div>
                        <div className="FForm">
                            <div className="FFSub">Если у вас есть вопросы</div>
                            <input className="InputName" type="text" placeholder="Имя" value={sendName} onChange={(e) => setSendName(e.target.value)} />
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
                            <div className={`FSubmit ${sendNumber.length === 11 && sendName.length > 0 ? 'SubmitRed' : ''}`} onClick={sendCall}>Отправить</div>
                        </div>
                    </div>
                    <div className="FWrap2">
                        <div className="FLine"></div>
                        <div className="FRevs">
                        <iframe title='карта' src="https://yandex.ru/map-widget/v1/?um=constructor%3A05c7ac2f6bb13fd9702cf2a97702b28f1dd4c7f722d58e31ddef5dd4721f261a&amp;source=constructor" width="320" height="240" frameborder="0"></iframe>
                            <a className="FRev" href="https://yandex.ru/maps/11127/nizhnekamsk/?ll=51.830880%2C55.636801&mode=poi&poi%5Bpoint%5D=51.830326%2C55.637247&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1749574440&tab" target="_blank" rel="noreferrer">
                                <img src={yandex} alt="" />
                                <div>Мы на Яндекс.Картах</div>
                            </a>
                            <a className="FRev" href="https://2gis.ru/geo/51.830273,55.637196" target="_blank" rel="noreferrer">
                                <img src={gis} alt="" />
                                <div>Отзывы на 2ГИС</div>
                            </a>
                            </div>
                        <div className="FLine"></div>
                        <div className="FLinks">
                            <div className="FLSub">Связаться с нами:</div>
                            
                            <div className="FLNum">
                                <a href="tel:+79874174714 ">+7 (995) 194-52-33</a>
                                <span> (Whats App, Telegram)</span>
                            </div>
                            <div className="FLNum">
                                <a href="tel:+79874199676">+7 (917) 852-71-70</a>
                                <span> (Дополнительный телефон для связи)</span>
                            </div>
                            <div className="FLMedia">
                                <a href="https://vk.com/club224887369" target="_blank" rel="noreferrer"><img src={vk} alt="Вконтакте" /></a>
                                <a href="https://t.me/botfather" target="_blank" rel="noreferrer"><img src={tg} alt="Телеграм" /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="FooterBottom">© Все права защищены 2016, ВЫБОР НК</div>
            </footer>
            <div className="MinuteForm None" onClick={closeForm}>
                <div className="MContainer form">
                    <IoIosCloseCircle className="CloseForm" size={40} />
                    <div className="MImg form">
                        <img src={form} className="form" alt="Клюшки" />
                    </div>
                    <div className="MContent form">
                        <div className="MSub form">Введите ваш номер, мы перезвоним!</div>
                        <div className="InputContainer form">
                            <span className="PreNum form">+7&nbsp;</span>
                            <input
                                className="InputNumber form"
                                id="num2"
                                type="text"
                                maxLength="15"
                                value={phoneNumber2}
                                onChange={(e) => {
                                    handlePhoneChange(e)
                                }}
                                onKeyDown={handleBackspace}
                                placeholder="(999) 999-99-99"
                            />
                        </div>
                        <div className={`FSubmit form ${sendNumber2.length === 11 ? 'SubmitRed' : ''}`} onClick={sendForm}>Отправить</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;