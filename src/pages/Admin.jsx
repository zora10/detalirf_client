import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

import { IoMdTrash } from 'react-icons/io'
import { BiImageAdd } from 'react-icons/bi'
import { PiTable } from 'react-icons/pi'
import { AiOutlineFileImage } from 'react-icons/ai'

import '../styles/admin.scss'
import { addOld, createMany, createNew, deleteItems, fetchOriginals, fetchReplicas, fetchRestored, findImages, updateItemAndImages } from "../http/itemApi";

const Admin = () => {
    const [isChecked, setIsChecked] = useState(false)
    const [chosen, setChosen] = useState('original')
    const [originals, setOriginals] = useState(null)
    const [replicas, setReplicas] = useState(null)
    const [restored, setRestored] = useState(null)
    const [createOriginal, setCreateOriginal] = useState(false)
    const [createReplica, setCreateReplica] = useState(false)
    const [createRestored, setCreateRestored] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [canDelete, setCanDelete] = useState(false)
    const [data, setData] = useState({
        code: '',
        brand: '',
        name: '',
        description: '',
        price: '',
        grip: '',
        bend: '0',
        rigidity: '0',
        count: '',
        renew: '',
        height: '',
        file: null,
        files: null
    })
    const [changeItem, setChangeItem] = useState(null)
    const [changeImages, setChangeImages] = useState(null)
    const [deleteImages, setDeleteImages] = useState([])
    const [newImages, setNewImages] = useState({
        file: null,
        files: null
    })
    const [table, setTable] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const check = (e) => {
        e.preventDefault()
        const value = document.querySelector('.CheckInput').value
        if (value === process.env.REACT_APP_ADMIN) {
            setIsChecked(true)
        } else {
            document.querySelector('.CheckInput').value = ''
            document.querySelector('.CheckWrong').classList.add('Error')
        }
    }

    const chooseTab = (e) => {
        setChosen(e.target.id)
        const tabs = document.getElementsByClassName('PanelTab')
        for (let i of tabs) {
            i.classList.remove('Chosen')
        }
        e.target.classList.add('Chosen')
        if (e.target.id === 'original') {
            fetchOriginals().then(data => {
                setOriginals(data)
            })
        }
        if (e.target.id === 'replica') {
            fetchReplicas().then(data => {
                setReplicas(data)
            })
        }
        if (e.target.id === 'restored') {
            fetchRestored().then(data => {
                setRestored(data)
            })
        }
        cancelCreate()
        setToDelete(null)
        setCanDelete(false)
        setChangeItem(null)
        setTable(null)
        setUploading(false)
        setUploaded(false)
    }

    const checkboxClick = (e, id) => {
        if (!e.target.classList.contains(`Check${id}`)) {
            const checkbox = document.querySelector(`.Check${id}`)
            checkbox.checked ? checkbox.checked = false : checkbox.checked = true
        }
    }

    const checkboxClickAll = (e) => {
        const checkboxes = document.getElementsByClassName('Checkbox')
        if (e.target.classList.contains(`CheckAll`)) {
            for (let i of checkboxes) {
                if (!i.classList.contains('CheckAll'))
                    i.checked ? i.checked = false : i.checked = true
            }
        }
    }

    const checkboxThrow = () => {
        const checkboxes = document.getElementsByClassName('Checkbox')
        for (let i of checkboxes) {
            i.checked = false
        }
        setToDelete(null)
    }

    const deleteMany = () => {
        const checkboxes = document.getElementsByClassName('Checkbox')
        let idArr = []
        for (let i of checkboxes) {
            if (i.checked === true && !i.classList.contains('CheckAll')) idArr.push(i.id)
        }
        if (idArr.length > 0) {
            setToDelete(idArr)
            setCanDelete(true)
        }
    }

    const deleteConfirm = () => {
        if (toDelete.length > 0) {
            switch (chosen) {
                case 'original':
                    setOriginals(null)
                    deleteItems(toDelete).then(() => {
                        setCanDelete(false)
                        fetchOriginals().then(data => {
                            setOriginals(data)
                        })
                    })
                    break

                case 'replica':
                    setReplicas(null)
                    deleteItems(toDelete).then(() => {
                        setCanDelete(false)
                        fetchReplicas().then(data => {
                            setReplicas(data)
                        })
                    })
                    break

                case 'restored':
                    setRestored(null)
                    deleteItems(toDelete).then(() => {
                        setCanDelete(false)
                        fetchRestored().then(data => {
                            setRestored(data)
                        })
                    })
                    break

                default:
                    break
            }
        }
    }

    const cancelDelete = () => {
        setCanDelete(false)
    }

    const setFiles = (e) => {
        const unset = document.querySelector(`.${e.target.id}Unset`)
        const set = document.querySelector(`.${e.target.id}Set`)
        const clear = document.querySelector(`.${e.target.id}Clear`)

        if (e.target.files.length === 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = e.target.files[0].name
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
        }

        if (e.target.files.length > 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = 'Выбрано файлов: ' + e.target.files.length
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
        }
    }

    const clearFiles = (e) => {
        document.querySelector(`.${e.target.id}Input`).value = null
        document.querySelector(`.${e.target.id}Unset`).classList.add('Showed')
        document.querySelector(`.${e.target.id}Set`).classList.remove('Showed')
        document.querySelector(`.${e.target.id}Clear`).classList.remove('Showed')
        setData((prevFormData) => ({
            ...prevFormData,
            [e.target.classList[0]]: null,
        }))
        setTable(null)
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target

        let newValue = value

        let images = []

        if (name === 'price' || name === 'bend' || name === 'rigidity' || name === 'count' || name === 'height') {
            newValue = ('' + newValue).replace(/\D/g, '')
        }

        if (name === 'file') {
            images = files[0]
        }

        if (name === 'files') {
            images = files
        }

        setData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'file' ? images : newValue,
        }))
    }

    const cancelCreate = () => {
        setData({
            code: '',
            brand: '',
            name: '',
            description: '',
            price: '',
            grip: '',
            bend: '123',
            rigidity: '123',
            count: '',
            renew: '',
            height: '',
            file: null,
            files: null
        })
        setCreateOriginal(false)
        setCreateReplica(false)
        setCreateRestored(false)
    }

    const createNewItem = () => {
        if (data.code && data.brand && data.name && data.description && data.price && data.grip && data.bend && data.rigidity && chosen && data.count && data.file && data.files) {
            createNew(data.code, data.brand, data.name, data.description, data.price, data.grip, data.bend, data.rigidity, chosen, data.count, data.renew, data.file, data.files)
                .then(() => {
                    if (chosen === 'original') {
                        setOriginals(null)
                        fetchOriginals().then(data => {
                            setOriginals(data)
                        })
                    }
                    if (chosen === 'replica') {
                        setReplicas(null)
                        fetchReplicas().then(data => {
                            setReplicas(data)
                        })
                    }
                    if (chosen === 'restored') {
                        setRestored(null)
                        fetchRestored().then(data => {
                            setRestored(data)
                        })
                    }
                    cancelCreate()
                })
        } else {
            switch (chosen) {
                case 'original':
                    document.querySelector('.origWarning').classList.add('Error')
                    break

                case 'replica':
                    document.querySelector('.repWarning').classList.add('Error')
                    break

                default:
                    break
            }
        }
    }

    const createOldItem = () => {
        try {
            if (data.code && data.brand && data.name && data.price && data.grip && data.bend && data.rigidity && chosen && data.renew && data.height) {
                addOld(data.code, data.brand, data.name, data.description, data.price, data.grip, data.bend, data.rigidity, chosen, data.renew, data.height)
                    .then(() => {
                        if (chosen === 'original') {
                            setOriginals(null)
                            fetchOriginals().then(data => {
                                setOriginals(data)
                            })
                        }
                        if (chosen === 'replica') {
                            setReplicas(null)
                            fetchReplicas().then(data => {
                                setReplicas(data)
                            })
                        }
                        if (chosen === 'restored') {
                            setRestored(null)
                            fetchRestored().then(data => {
                                setRestored(data)
                            })
                        }
                        cancelCreate()
                    })
            } else {
                document.querySelector('.restWarning').classList.add('Error')
            }
        } catch (e) {
            if (e.status === 409) {
                switch (chosen) {
                    case 'original':
                        const err = document.querySelector('.origWarning')
                        err && err.classList.add('Error')
                        break

                    case 'replica':
                        const err2 = document.querySelector('.repWarning')
                        err2 && err2.classList.add('Error')
                        break

                    case 'restored':
                        const err3 = document.querySelector('.restWarning')
                        err3 && err3.classList.add('Error')
                        break

                    default:
                        break
                }
            }
        }
    }

    const changeItemClick = (item) => {
        findImages(item.id)
            .then((data) => {
                setChangeItem(item)
                setChangeImages(data)
            })
            .finally(() => {
                setChangeItem(item)
            })
    }

    const deleteImgClick = (id) => {
        const img = document.querySelector(`.Img${id}`)
        img.classList.toggle('ChooseImg')
        if (img.classList.contains('ChooseImg')) {
            setDeleteImages((prevDeleteImages) => [...prevDeleteImages, id])
        } else {
            setDeleteImages((prevDeleteImages) => prevDeleteImages.filter((imageId) => imageId !== id))
        }
    }

    const changeConfirm = () => {
        if (chosen === 'restored' && !changeItem.height) {
            document.querySelector('.restWarning').classList.add('Error')
            return
        }
        if (changeItem.code && changeItem.brand && changeItem.name && changeItem.price && changeItem.grip && changeItem.bend && changeItem.rigidity && changeItem.count) {
            updateItemAndImages(changeItem.id, changeItem.code, changeItem.brand, changeItem.name, changeItem.description, changeItem.price, changeItem.grip, changeItem.bend, changeItem.rigidity, changeItem.count, changeItem.renew, changeItem.height ? changeItem.height : 1, newImages.file, newImages.files, deleteImages)
                .then(() => {
                    if (chosen === 'original') {
                        setOriginals(null)
                        fetchOriginals().then(data => {
                            setOriginals(data)
                        })
                    }
                    if (chosen === 'replica') {
                        setReplicas(null)
                        fetchReplicas().then(data => {
                            setReplicas(data)
                        })
                    }
                    if (chosen === 'restored') {
                        setRestored(null)
                        fetchRestored().then(data => {
                            setRestored(data)
                        })
                    }
                    setChangeItem(null)
                    setDeleteImages([])
                    setNewImages({
                        file: null,
                        files: null
                    })
                })
        } else {
            switch (chosen) {
                case 'original':
                    document.querySelector('.origWarning').classList.add('Error')
                    break

                case 'replica':
                    document.querySelector('.repWarning').classList.add('Error')
                    break

                case 'restored':
                    document.querySelector('.restWarning').classList.add('Error')
                    break

                default:
                    break
            }
        }
    }

    const handleChangeItem = (e) => {
        const { name, value, type, files } = e.target

        let newValue = value

        let images = []

        if (name === 'price' || name === 'bend' || name === 'rigidity' || name === 'count' || name === 'height') {
            newValue = ('' + newValue).replace(/\D/g, '')
        }

        if (name === 'file') {
            images = files[0]
        }

        if (name === 'files') {
            images = files
        }

        if (name !== 'file' && name !== 'files') {
            setChangeItem((prevFormData) => ({
                ...prevFormData,
                [name]: type === 'file' ? images : newValue,
            }))
        } else {
            setNewImages((prevFormData) => ({
                ...prevFormData,
                [name]: images
            }))
        }
    }

    const cancelChange = () => {
        setChangeItem(null)
        setDeleteImages([])
        setNewImages({
            file: null,
            files: null
        })
    }

    const tableUpload = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            const data = reader.result
            const workbook = XLSX.read(data, {
                type: 'binary'
            })
            workbook.SheetNames.forEach((sheetName) => {
                const rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
                setTable(rowObject)
            })
        }
        reader.readAsBinaryString(file)
    }

    const tableSend = () => {
        if (table) {
            setUploading(true)
            createMany(table).then(() => {
                setUploading(false)
                setUploaded(true)
                setTable(null)
                try {
                    document.querySelector('.tablefileInput').value = null
                    document.querySelector('.tablefileUnset').classList.add('Showed')
                    document.querySelector('.tablefileSet').classList.remove('Showed')
                    document.querySelector('.tablefileClear').classList.remove('Showed')
                } catch (e) {

                }
            })
        }
    }

    useEffect(() => {
        fetchOriginals().then(data => {
            setOriginals(data)
        })
    }, [])

    return (
        <div className="AdminContainer">
            <div className="AdminSub">Панель администратора</div>
            {!isChecked ?
                <div className="AdminCheck">
                    <form onSubmit={check}>
                        <input className="CheckInput" type="password" placeholder="Код доступа" />
                    </form>
                    <div className="CheckNext" onClick={check}>Продолжить</div>
                    <div className="CheckWrong">Неверный код</div>
                </div>
                :
                <>
                    <div className="Panel">
                        <div className="PanelHead">
                            <div className="PanelTab Chosen" id="original" onClick={chooseTab}>ТОВАРЫ</div>
                        </div>
                        <div className="Workspace">
                            {chosen === 'original' ?
                                <>
                                    <div className="CreateBtn" onClick={() => setCreateOriginal(true)}>Создать товар</div>
                                    {!createOriginal ?
                                        <>
                                            {originals ?
                                                <>
                                                    {!changeItem ?
                                                        <>
                                                            {originals.length > 0 ?
                                                                <>
                                                                    {!canDelete ?
                                                                        <div className="DeleteContainer">
                                                                            <div className="DeleteBtn" onClick={deleteMany}>Удалить выбранное</div>
                                                                            <div className="ThrowCheck" onClick={checkboxThrow}>Сбросить выбор</div>
                                                                        </div>
                                                                        :
                                                                        <div className="DeleteConfirm">
                                                                            <div className="ConfirmText">Вы уверены, что хотите удалить выбранные товары?</div>
                                                                            <div className="ConfirmBtns">
                                                                                <div className="DeleteBtn" onClick={deleteConfirm}>Удалить</div>
                                                                                <div className="DeleteCancel" onClick={cancelDelete}>Отменить</div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    <div className="Clue">Для редактирования нажмите на нужный товар</div>
                                                                    <div className="TableClue Light">Листать вправо →</div>
                                                                    <div className="TableWrap">
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th><input type="checkbox" className={`Checkbox CheckAll`} onClick={checkboxClickAll} /></th>
                                                                                    <th>Артикул</th>
                                                                                    <th>Фирма</th>
                                                                                    <th>Название</th>
                                                                                    <th>Категория</th>
                                                                                    <th>Цена</th>
                                                                                    <th>Кол-во</th>
                                                                                </tr>
                                                                                {originals.map((item, i) => {
                                                                                    return (
                                                                                        <tr key={item.id} className="ItemRow">
                                                                                            <td onClick={(e) => checkboxClick(e, item.id)}>
                                                                                                <input type="checkbox" className={`Checkbox Check${item.id}`} id={item.id} />
                                                                                            </td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.code}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.brand}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.name}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.grip}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.price}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.count}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </>
                                                                :
                                                                <div className="NoItems">Товаров нет</div>
                                                            }
                                                        </>
                                                        :
                                                        <div className="CreateContainer">
                                                            <div className="CreateSub">Редактирование товара</div>
                                                            <div className="InputClue">Артикул</div>
                                                            <input type="text" placeholder="Артикул" name="code" maxLength={250} value={changeItem.code} onChange={handleChangeItem} />
                                                            <div className="InputClue">Фирма</div>
                                                            <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={changeItem.brand} onChange={handleChangeItem} />
                                                            <div className="InputClue">Название</div>
                                                            <input type="text" placeholder="Название" name="name" maxLength={250} value={changeItem.name} onChange={handleChangeItem} />
                                                            <div className="InputClue">Описание</div>
                                                            <textarea placeholder="Описание" name="description" value={changeItem.description} onChange={handleChangeItem}></textarea>
                                                            <div className="InputClue">Цена</div>
                                                            <input type="text" placeholder="Цена" name="price" maxLength={9} value={changeItem.price} onChange={handleChangeItem} />
                                                            <div className="InputClue">Категория</div>
                                                            <input type="text" placeholder="Категория" name="grip" maxLength={250} value={changeItem.grip} onChange={handleChangeItem} />
                                                            <input type="hidden" placeholder="Загиб" name="bend" maxLength={9} value={123} onChange={handleChangeItem} />
                                                            <input type="hidden" placeholder="Жесткость" name="rigidity" maxLength={9} value={123} onChange={handleChangeItem} />
                                                            <div className="InputClue">Количество</div>
                                                            <input type="text" placeholder="Количество" name="count" maxLength={9} value={changeItem.count} onChange={handleChangeItem} />
                                                            <div className="PhotoChange">
                                                                <div className="InputClue">Старая обложка (чтобы удалить, загрузите фото в поле "Новая обложка")</div>
                                                                <div className="ChangeImgContainer">
                                                                    <img src={`${process.env.REACT_APP_API_URL + changeItem.img}`} alt="" />
                                                                </div>
                                                            </div>
                                                            {changeImages.length > 0 &&
                                                                <div className="PhotoChange PhChange2">
                                                                    <div className="InputClue">Старые фотографии карточки (нажмите на фото, чтобы удалить)</div>
                                                                    <div className="ChangeImgContainer ArrayImg">
                                                                        {changeImages.map((img, i) => {
                                                                            return (
                                                                                <div key={i} className={`ImgChange Img${img.id}`}>
                                                                                    <div className="ImgChangeDelete" onClick={() => deleteImgClick(img.id)}><IoMdTrash size={70} /></div>
                                                                                    <img src={`${process.env.REACT_APP_API_URL + img.img}`} alt="" />
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            }
                                                            <div className="InputClue">Новая обложка</div>
                                                            <div className="FileInput origfile">
                                                                <input
                                                                    className="origfileInput"
                                                                    type="file"
                                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                    multiple={false}
                                                                    id="origfile"
                                                                    name="file"
                                                                    onChange={(e) => {
                                                                        setFiles(e)
                                                                        handleChangeItem(e)
                                                                    }}
                                                                />
                                                                <div className="FileInfo origfileUnset Showed">
                                                                    <div className="FileText">
                                                                        <BiImageAdd className="FileImg" size={30} />
                                                                        <div className="FileTextLoad">Обложка товара</div>
                                                                    </div>
                                                                    <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                </div>
                                                                <div className="FileInfo origfileSet">
                                                                    <div className="FileText">
                                                                        <AiOutlineFileImage size={30} />
                                                                        <div className="FileTextLoad origfileName"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="file FileClear origfileClear" id="origfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                                            <div className="InputClue">Новые фотографии карточки</div>
                                                            <div className="FileInput origfiles">
                                                                <input
                                                                    className="origfilesInput"
                                                                    type="file"
                                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                    multiple={true}
                                                                    id="origfiles"
                                                                    name="files"
                                                                    onChange={(e) => {
                                                                        setFiles(e)
                                                                        handleChangeItem(e)
                                                                    }}
                                                                />
                                                                <div className="FileInfo origfilesUnset Showed">
                                                                    <div className="FileText">
                                                                        <BiImageAdd className="FileImg" size={30} />
                                                                        <div className="FileTextLoad">Фотографии карточки</div>
                                                                    </div>
                                                                    <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                </div>
                                                                <div className="FileInfo origfilesSet">
                                                                    <div className="FileText">
                                                                        <AiOutlineFileImage size={30} />
                                                                        <div className="FileTextLoad origfilesName"></div>
                                                                    </div>
                                                                    <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                                </div>
                                                            </div>
                                                            <div className="files FileClear origfilesClear" id="origfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                                            <div className="CreateWarning origWarning">Заполните все поля!</div>
                                                            <div className="CreateItemBtn" onClick={changeConfirm}>Сохранить</div>
                                                            <div className="CreateCancelItemBtn" onClick={cancelChange}>Отменить</div>
                                                        </div>
                                                    }
                                                </>
                                                :
                                                <div className="LoaderContainer2">
                                                    <div className="LoaderLight"></div>
                                                </div>
                                            }
                                        </>
                                        :
                                        <div className="CreateContainer">
                                            <div className="CreateSub">Добавление товара</div>
                                            <div className="InputClue">Артикул</div>
                                            <input type="text" placeholder="Артикул" name="code" maxLength={250} value={data.code} onChange={handleChange} />
                                            <div className="InputClue">Фирма</div>
                                            <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={data.brand} onChange={handleChange} />
                                            <div className="InputClue">Название</div>
                                            <input type="text" placeholder="Название" name="name" maxLength={250} value={data.name} onChange={handleChange} />
                                            <div className="InputClue">Описание</div>
                                            <textarea placeholder="Описание" name="description" value={data.description} onChange={handleChange}></textarea>
                                            <div className="InputClue">Цена</div>
                                            <input type="text" placeholder="Цена" name="price" maxLength={9} value={data.price} onChange={handleChange} />
                                            <div className="InputClue">Категория</div>
                                            <input type="text" placeholder="Категория" name="grip" maxLength={250} value={data.grip} onChange={handleChange} />
                                            <input type="hidden" placeholder="Загиб" name="bend" maxLength={9} value={123} onChange={handleChange} />
                                            <input type="hidden" placeholder="Жесткость" name="rigidity" maxLength={9} value={123} onChange={handleChange} />
                                            <div className="InputClue">Количество</div>
                                            <input type="text" placeholder="Количество" name="count" maxLength={9} value={data.count} onChange={handleChange} />
                                            <div className="InputClue">Обложка</div>
                                            <div className="FileInput origfile">
                                                <input
                                                    className="origfileInput"
                                                    type="file"
                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                    multiple={false}
                                                    id="origfile"
                                                    name="file"
                                                    onChange={(e) => {
                                                        setFiles(e)
                                                        handleChange(e)
                                                    }}
                                                />
                                                <div className="FileInfo origfileUnset Showed">
                                                    <div className="FileText">
                                                        <BiImageAdd className="FileImg" size={30} />
                                                        <div className="FileTextLoad">Обложка товара</div>
                                                    </div>
                                                    <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                </div>
                                                <div className="FileInfo origfileSet">
                                                    <div className="FileText">
                                                        <AiOutlineFileImage size={30} />
                                                        <div className="FileTextLoad origfileName"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="file FileClear origfileClear" id="origfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                            <div className="InputClue">Фотографии карточки</div>
                                            <div className="FileInput origfiles">
                                                <input
                                                    className="origfilesInput"
                                                    type="file"
                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                    multiple={true}
                                                    id="origfiles"
                                                    name="files"
                                                    onChange={(e) => {
                                                        setFiles(e)
                                                        handleChange(e)
                                                    }}
                                                />
                                                <div className="FileInfo origfilesUnset Showed">
                                                    <div className="FileText">
                                                        <BiImageAdd className="FileImg" size={30} />
                                                        <div className="FileTextLoad">Фотографии карточки</div>
                                                    </div>
                                                    <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                </div>
                                                <div className="FileInfo origfilesSet">
                                                    <div className="FileText">
                                                        <AiOutlineFileImage size={30} />
                                                        <div className="FileTextLoad origfilesName"></div>
                                                    </div>
                                                    <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                </div>
                                            </div>
                                            <div className="files FileClear origfilesClear" id="origfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                            <div className="CreateWarning origWarning">Заполните все поля!</div>
                                            <div className="CreateWarning origError">Такой товар уже существует!</div>
                                            <div className="CreateItemBtn" onClick={createNewItem}>Создать</div>
                                            <div className="CreateCancelItemBtn" onClick={cancelCreate}>Отменить</div>
                                        </div>
                                    }
                                </>
                                :
                                (chosen === 'replica') ?
                                    <>
                                        <div className="CreateBtn" onClick={() => setCreateReplica(true)}>Создать товар</div>
                                        {!createReplica ?
                                            <>
                                                {replicas ?
                                                    <>
                                                        {!changeItem ?
                                                            <>
                                                                {replicas.length > 0 ?
                                                                    <>
                                                                        {!canDelete ?
                                                                            <div className="DeleteContainer">
                                                                                <div className="DeleteBtn" onClick={deleteMany}>Удалить выбранное</div>
                                                                                <div className="ThrowCheck" onClick={checkboxThrow}>Сбросить выбор</div>
                                                                            </div>
                                                                            :
                                                                            <div className="DeleteConfirm">
                                                                                <div className="ConfirmText">Вы уверены, что хотите удалить выбранные товары?</div>
                                                                                <div className="ConfirmBtns">
                                                                                    <div className="DeleteBtn" onClick={deleteConfirm}>Удалить</div>
                                                                                    <div className="DeleteCancel" onClick={cancelDelete}>Отменить</div>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        <div className="Clue">Для редактирования нажмите на нужный товар</div>
                                                                        <div className="TableWrap">
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th><input type="checkbox" className={`Checkbox CheckAll`} onClick={checkboxClickAll} /></th>
                                                                                        <th>Артикул</th>
                                                                                        <th>Фирма</th>
                                                                                        <th>Название</th>
                                                                                        <th>Категория</th>
                                                                                        <th>Загиб</th>
                                                                                        <th>Жесткость</th>
                                                                                        <th>Цена</th>
                                                                                        <th>Кол-во</th>
                                                                                        {/* <th>Удалить</th> */}
                                                                                    </tr>
                                                                                    {replicas.map((item, i) => {
                                                                                        return (
                                                                                            <tr key={item.id} className="ItemRow">
                                                                                                <td onClick={(e) => checkboxClick(e, item.id)}>
                                                                                                    <input type="checkbox" className={`Checkbox Check${item.id}`} id={item.id} />
                                                                                                </td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.code}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.brand}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.name}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.grip}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.bend}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.rigidity}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.price}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.count}</td>
                                                                                                {/* <td className="DeleteRow"><IoMdTrash size={20} /></td> */}
                                                                                            </tr>
                                                                                        )
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <div className="NoItems">Товаров нет</div>
                                                                }
                                                            </>
                                                            :
                                                            <div className="CreateContainer">
                                                                <div className="CreateSub">Редактирование товара</div>
                                                                <div className="InputClue">Артикул</div>
                                                                <input type="text" placeholder="Артикул" name="code" maxLength={250} value={changeItem.code} onChange={handleChangeItem} />
                                                                <div className="InputClue">Фирма</div>
                                                                <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={changeItem.brand} onChange={handleChangeItem} />
                                                                <div className="InputClue">Название</div>
                                                                <input type="text" placeholder="Название" name="name" maxLength={250} value={changeItem.name} onChange={handleChangeItem} />
                                                                <div className="InputClue">Описание</div>
                                                                <textarea placeholder="Описание" name="description" value={changeItem.description} onChange={handleChangeItem}></textarea>
                                                                <div className="InputClue">Цена</div>
                                                                <input type="text" placeholder="Цена" name="price" maxLength={9} value={changeItem.price} onChange={handleChangeItem} />
                                                                <div className="InputClue">Категория</div>
                                                                <input type="text" placeholder="Категория" name="grip" maxLength={250} value={changeItem.grip} onChange={handleChangeItem} />
                                                                <div className="InputClue">Загиб</div>
                                                                <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={changeItem.bend} onChange={handleChangeItem} />
                                                                <div className="InputClue">Жесткость</div>
                                                                <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={changeItem.rigidity} onChange={handleChangeItem} />
                                                                <div className="InputClue">Количество</div>
                                                                <input type="text" placeholder="Количество" name="count" maxLength={9} value={changeItem.count} onChange={handleChangeItem} />
                                                                <div className="PhotoChange">
                                                                    <div className="InputClue">Старая обложка (чтобы удалить, загрузите фото в поле "Новая обложка")</div>
                                                                    <div className="ChangeImgContainer">
                                                                        <img src={`${process.env.REACT_APP_API_URL + changeItem.img}`} alt="" />
                                                                    </div>
                                                                </div>
                                                                {changeImages.length > 0 &&
                                                                    <div className="PhotoChange PhChange2">
                                                                        <div className="InputClue">Старые фотографии карточки (нажмите на фото, чтобы удалить)</div>
                                                                        <div className="ChangeImgContainer ArrayImg">
                                                                            {changeImages.map((img, i) => {
                                                                                return (
                                                                                    <div key={i} className={`ImgChange Img${img.id}`}>
                                                                                        <div className="ImgChangeDelete" onClick={() => deleteImgClick(img.id)}><IoMdTrash size={70} /></div>
                                                                                        <img src={`${process.env.REACT_APP_API_URL + img.img}`} alt="" />
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="InputClue">Новая обложка</div>
                                                                <div className="FileInput repfile">
                                                                    <input
                                                                        className="repfileInput"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                        multiple={false}
                                                                        id="repfile"
                                                                        name="file"
                                                                        onChange={(e) => {
                                                                            setFiles(e)
                                                                            handleChangeItem(e)
                                                                        }}
                                                                    />
                                                                    <div className="FileInfo repfileUnset Showed">
                                                                        <div className="FileText">
                                                                            <BiImageAdd className="FileImg" size={30} />
                                                                            <div className="FileTextLoad">Обложка товара</div>
                                                                        </div>
                                                                        <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                                        <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                    </div>
                                                                    <div className="FileInfo repfileSet">
                                                                        <div className="FileText">
                                                                            <AiOutlineFileImage size={30} />
                                                                            <div className="FileTextLoad repfileName"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="file FileClear repfileClear" id="repfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                                                <div className="InputClue">Новые фотографии карточки</div>
                                                                <div className="FileInput repfiles">
                                                                    <input
                                                                        className="repfilesInput"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                        multiple={true}
                                                                        id="repfiles"
                                                                        name="files"
                                                                        onChange={(e) => {
                                                                            setFiles(e)
                                                                            handleChangeItem(e)
                                                                        }}
                                                                    />
                                                                    <div className="FileInfo repfilesUnset Showed">
                                                                        <div className="FileText">
                                                                            <BiImageAdd className="FileImg" size={30} />
                                                                            <div className="FileTextLoad">Фотографии карточки</div>
                                                                        </div>
                                                                        <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                                        <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                    </div>
                                                                    <div className="FileInfo repfilesSet">
                                                                        <div className="FileText">
                                                                            <AiOutlineFileImage size={30} />
                                                                            <div className="FileTextLoad repfilesName"></div>
                                                                        </div>
                                                                        <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                                    </div>
                                                                </div>
                                                                <div className="files FileClear repfilesClear" id="repfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                                                <div className="CreateWarning repWarning">Заполните все поля!</div>
                                                                <div className="CreateItemBtn" onClick={changeConfirm}>Сохранить</div>
                                                                <div className="CreateCancelItemBtn" onClick={cancelChange}>Отменить</div>
                                                            </div>
                                                        }
                                                    </>
                                                    :
                                                    <div className="LoaderContainer2">
                                                        <div className="LoaderLight"></div>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className="CreateContainer">
                                                    <div className="CreateSub">Добавление товара</div>
                                                    <div className="InputClue">Артикул</div>
                                                    <input type="text" placeholder="Артикул" name="code" maxLength={250} value={data.code} onChange={handleChange} />
                                                    <div className="InputClue">Фирма</div>
                                                    <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={data.brand} onChange={handleChange} />
                                                    <div className="InputClue">Название</div>
                                                    <input type="text" placeholder="Название" name="name" maxLength={250} value={data.name} onChange={handleChange} />
                                                    <div className="InputClue">Описание</div>
                                                    <textarea placeholder="Описание" name="description" value={data.description} onChange={handleChange}></textarea>
                                                    <div className="InputClue">Цена</div>
                                                    <input type="text" placeholder="Цена" name="price" maxLength={9} value={data.price} onChange={handleChange} />
                                                    <div className="InputClue">Категория</div>
                                                    <input type="text" placeholder="Категория" name="grip" maxLength={250} value={data.grip} onChange={handleChange} />
                                                    <input type="hidden" placeholder="Загиб" name="bend" maxLength={9} value={123} onChange={handleChange} />
                                                    <input type="hidden" placeholder="Жесткость" name="rigidity" maxLength={9} value={123} onChange={handleChange} />
                                                    <div className="InputClue">Количество</div>
                                                    <input type="text" placeholder="Количество" name="count" maxLength={9} value={data.count} onChange={handleChange} />
                                                    <div className="InputClue">Обложка</div>
                                                    <div className="FileInput repfile">
                                                        <input
                                                            className="repfileInput"
                                                            type="file"
                                                            accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                            multiple={false}
                                                            id="repfile"
                                                            name="file"
                                                            onChange={(e) => {
                                                                setFiles(e)
                                                                handleChange(e)
                                                            }}
                                                        />
                                                        <div className="FileInfo repfileUnset Showed">
                                                            <div className="FileText">
                                                                <BiImageAdd className="FileImg" size={30} />
                                                                <div className="FileTextLoad">Обложка товара</div>
                                                            </div>
                                                            <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                            <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                        </div>
                                                        <div className="FileInfo repfileSet">
                                                            <div className="FileText">
                                                                <AiOutlineFileImage size={30} />
                                                                <div className="FileTextLoad repfileName"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="file FileClear repfileClear" id="repfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                                    <div className="InputClue">Фотографии карточки</div>
                                                    <div className="FileInput repfiles">
                                                        <input
                                                            className="repfilesInput"
                                                            type="file"
                                                            accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                            multiple={true}
                                                            id="repfiles"
                                                            name="files"
                                                            onChange={(e) => {
                                                                setFiles(e)
                                                                handleChange(e)
                                                            }}
                                                        />
                                                        <div className="FileInfo repfilesUnset Showed">
                                                            <div className="FileText">
                                                                <BiImageAdd className="FileImg" size={30} />
                                                                <div className="FileTextLoad">Фотографии карточки</div>
                                                            </div>
                                                            <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                            <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                        </div>
                                                        <div className="FileInfo repfilesSet">
                                                            <div className="FileText">
                                                                <AiOutlineFileImage size={30} />
                                                                <div className="FileTextLoad repfilesName"></div>
                                                            </div>
                                                            <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                        </div>
                                                    </div>
                                                    <div className="files FileClear repfilesClear" id="repfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                                    <div className="CreateWarning repWarning">Заполните все поля!</div>
                                                    <div className="CreateWarning repError">Такой товар уже существует!</div>
                                                    <div className="CreateItemBtn" onClick={createNewItem}>Создать</div>
                                                    <div className="CreateCancelItemBtn" onClick={cancelCreate}>Отменить</div>
                                                </div>
                                            </>
                                        }
                                    </>
                                    : (chosen === 'restored') ?
                                        <>
                                            <div className="CreateBtn" onClick={() => setCreateRestored(true)}>Создать товар</div>
                                            {!createRestored ?
                                                <>
                                                    {restored ?
                                                        <>
                                                            {!changeItem ?
                                                                <>
                                                                    {restored.length > 0 ?
                                                                        <>
                                                                            {!canDelete ?
                                                                                <div className="DeleteContainer">
                                                                                    <div className="DeleteBtn" onClick={deleteMany}>Удалить выбранное</div>
                                                                                    <div className="ThrowCheck" onClick={checkboxThrow}>Сбросить выбор</div>
                                                                                </div>
                                                                                :
                                                                                <div className="DeleteConfirm">
                                                                                    <div className="ConfirmText">Вы уверены, что хотите удалить выбранные товары?</div>
                                                                                    <div className="ConfirmBtns">
                                                                                        <div className="DeleteBtn" onClick={deleteConfirm}>Удалить</div>
                                                                                        <div className="DeleteCancel" onClick={cancelDelete}>Отменить</div>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            <div className="Clue">Для редактирования нажмите на нужный товар</div>
                                                                            <div className="TableWrap">
                                                                                <table>
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <th><input type="checkbox" className={`Checkbox CheckAll`} onClick={checkboxClickAll} /></th>
                                                                                            <th>Артикул</th>
                                                                                            <th>Фирма</th>
                                                                                            <th>Название</th>
                                                                                            <th>Категория</th>
                                                                                            <th>Загиб</th>
                                                                                            <th>Жесткость</th>
                                                                                            <th>Высота</th>
                                                                                            <th>Цена</th>
                                                                                            <th>Ремонт</th>
                                                                                            <th>Кол-во</th>
                                                                                        </tr>
                                                                                        {restored.map((item, i) => {
                                                                                            return (
                                                                                                <tr key={item.id} className="ItemRow">
                                                                                                    <td onClick={(e) => checkboxClick(e, item.id)}>
                                                                                                        <input type="checkbox" className={`Checkbox Check${item.id}`} id={item.id} />
                                                                                                    </td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.code}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.brand}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.name}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.grip}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.bend}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.rigidity}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.height}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.price}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.renew}</td>
                                                                                                    <td onClick={() => changeItemClick(item)}>{item.count}</td>
                                                                                                </tr>
                                                                                            )
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <div className="NoItems">Товаров нет</div>
                                                                    }
                                                                </>
                                                                :
                                                                <div className="CreateContainer">
                                                                    <div className="CreateSub">Редактирование товара</div>
                                                                    <div className="InputClue">Артикул</div>
                                                                    <input type="text" placeholder="Артикул" name="code" maxLength={250} value={changeItem.code} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Фирма</div>
                                                                    <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={changeItem.brand} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Название</div>
                                                                    <input type="text" placeholder="Название" name="name" maxLength={250} value={changeItem.name} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Цена</div>
                                                                    <input type="text" placeholder="Цена" name="price" maxLength={9} value={changeItem.price} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Категория</div>
                                                                    <input type="text" placeholder="Категория" name="grip" maxLength={250} value={changeItem.grip} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Загиб</div>
                                                                    <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={changeItem.bend} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Жесткость</div>
                                                                    <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={changeItem.rigidity} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Высота</div>
                                                                    <input type="text" placeholder="Высота" name="height" maxLength={9} value={changeItem.height} onChange={handleChangeItem} />
                                                                    <div className="InputClue">Ремонт</div>
                                                                    <input type="text" placeholder="Ремонт" name="renew" maxLength={250} value={changeItem.renew} onChange={handleChangeItem} />
                                                                    <div className="CreateWarning restWarning">Заполните все поля!</div>
                                                                    <div className="CreateItemBtn" onClick={changeConfirm}>Сохранить</div>
                                                                    <div className="CreateCancelItemBtn" onClick={cancelChange}>Отменить</div>
                                                                </div>
                                                            }
                                                        </>
                                                        :
                                                        <div className="LoaderContainer2">
                                                            <div className="LoaderLight"></div>
                                                        </div>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <div className="CreateContainer">
                                                        <div className="CreateSub">Добавление товара</div>
                                                        <div className="InputClue">Артикул</div>
                                                        <input type="text" placeholder="Артикул" name="code" maxLength={250} value={data.code} onChange={handleChange} />
                                                        <div className="InputClue">Фирма</div>
                                                        <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={data.brand} onChange={handleChange} />
                                                        <div className="InputClue">Название</div>
                                                        <input type="text" placeholder="Название" name="name" maxLength={250} value={data.name} onChange={handleChange} />
                                                        <div className="InputClue">Цена</div>
                                                        <input type="text" placeholder="Цена" name="price" maxLength={9} value={data.price} onChange={handleChange} />
                                                        <div className="InputClue">Категория</div>
                                                        <input type="text" placeholder="Категория" name="grip" maxLength={250} value={data.grip} onChange={handleChange} />
                                                        <input type="hidden" placeholder="Загиб" name="bend" maxLength={9} value={123} onChange={handleChange} />
                                                        <input type="hidden" placeholder="Жесткость" name="rigidity" maxLength={9} value={123} onChange={handleChange} />
                                                        <div className="InputClue">Высота</div>
                                                        <input type="text" placeholder="Высота" name="height" maxLength={9} value={data.height} onChange={handleChange} />
                                                        <div className="InputClue">Ремонт</div>
                                                        <input type="text" placeholder="Ремонт" name="renew" maxLength={250} value={data.renew} onChange={handleChange} />
                                                        <div className="CreateWarning restWarning">Заполните все поля!</div>
                                                        <div className="CreateWarning restError">Такой товар уже существует!</div>
                                                        <div className="CreateItemBtn" onClick={createOldItem}>Создать</div>
                                                        <div className="CreateCancelItemBtn" onClick={cancelCreate}>Отменить</div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <div className="TableInput tablefile">
                                                <input
                                                    className="tablefileInput"
                                                    type="file"
                                                    accept=".xlsx, .xls"
                                                    multiple={false}
                                                    id="tablefile"
                                                    name="files"
                                                    onChange={(e) => {
                                                        setFiles(e)
                                                        tableUpload(e)
                                                    }}
                                                />
                                                <div className="FileInfo tablefileUnset Showed">
                                                    <div className="FileText">
                                                        <PiTable size={30} />
                                                        <div className="FileTextLoad">Таблица товаров</div>
                                                    </div>
                                                    <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                    <div className="FileClue">Формат - xlsx или xls</div>
                                                </div>
                                                <div className="FileInfo tablefileSet">
                                                    <div className="FileText">
                                                        <PiTable size={30} />
                                                        <div className="FileTextLoad tablefileName"></div>
                                                    </div>
                                                    <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                </div>
                                            </div>
                                            <div className="files FileClear tablefileClear" id="tablefile" name="files" onClick={clearFiles}>Очистить поле</div>
                                            <div className={`UploadBtn ${table ? 'UploadActive' : ''}`} onClick={tableSend}>Выгрузить</div>
                                            {uploading &&
                                                <div className="Uploading">
                                                    <div className="LoaderSmall"></div>
                                                    <span>Не покидайте страницу!</span>
                                                </div>
                                            }
                                            {uploaded &&
                                                <div className="Uploading Success">Успешно выгружено</div>
                                            }
                                            <div className="TableXLClue">Правила оформления таблицы:</div>
                                            <div className="TableXLClue">
                                                1. Первая строка - названия столбцов. Обязательно должны присутствовать столбцы:
                                                Артикул, Фирма, Название, Описание, Цена, Категория, Загиб, Жесткость, Высота, Ремонт, Количество, Тип.
                                            </div>
                                            <div className="TableXLClue">
                                                2. Цена, Загиб, Жесткость, Высота и Количество могут принимать только числовые значения.
                                            </div>
                                            <div className="TableXLClue">
                                                3. Тип может принимать следующие значения: orig — для оригинала, rep — для реплики, vos — для восстановленных/бу.
                                            </div>
                                            <div className="TableXLClue">
                                                4. Если тип товара — оригинал или реплика, обязательно должны быть заполнены поля Артикул, Фирма,
                                                Название, Описание, Цена, Категория, Загиб, Жесткость, Количество, Тип.
                                            </div>
                                            <div className="TableXLClue">
                                                5. Если тип товара — восстановленные/бу, обязательно должны быть заполнены поля Артикул, Фирма,
                                                Название, Цена, Категория, Загиб, Жесткость, Высота, Ремонт, Тип.
                                            </div>
                                            <div className="TableXLClue">
                                                6. Все товары должны быть уникальными. Если в таблице есть товары с одновременно одинаковым артикулом, Категорияом, загибом,
                                                жесткостью и ремонтом (у восстановленных), то в базу будет добавлен только один из этих товаров.
                                            </div>
                                            <div className="TableXLClue">
                                                7. Товары, которые нарушают правила оформления, не будут добавлены в базу.
                                            </div>
                                            <div className="TableXLClue">Пример правильной таблицы:</div>
                                            <div className="TableWrap3">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <th>Артикул</th>
                                                            <th>Фирма</th>
                                                            <th>Название</th>
                                                            <th>Описание</th>
                                                            <th>Цена</th>
                                                            <th>Категория</th>
                                                            <th>Загиб</th>
                                                            <th>Жесткость</th>
                                                            <th>Высота</th>
                                                            <th>Ремонт</th>
                                                            <th>Количество</th>
                                                            <th>Тип</th>
                                                        </tr>
                                                        <tr>
                                                            <td>А123</td>
                                                            <td>Фирма1</td>
                                                            <td>Название1</td>
                                                            <td>Описание1</td>
                                                            <td>36990</td>
                                                            <td>Правый</td>
                                                            <td>28</td>
                                                            <td>70</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>50</td>
                                                            <td>orig</td>
                                                        </tr>
                                                        <tr>
                                                            <td>B124</td>
                                                            <td>Фирма2</td>
                                                            <td>Название2</td>
                                                            <td>Описание2</td>
                                                            <td>24990</td>
                                                            <td>Левый</td>
                                                            <td>29</td>
                                                            <td>90</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>20</td>
                                                            <td>rep</td>
                                                        </tr>
                                                        <tr>
                                                            <td>C125</td>
                                                            <td>Фирма3</td>
                                                            <td>Название3</td>
                                                            <td></td>
                                                            <td>15990</td>
                                                            <td>Правый</td>
                                                            <td>28</td>
                                                            <td>70</td>
                                                            <td>100</td>
                                                            <td>Крюк</td>
                                                            <td></td>
                                                            <td>vos</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default Admin;