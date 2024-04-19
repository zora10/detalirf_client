import {makeAutoObservable} from 'mobx'

const sortAscending = (arr) => {
    return arr.slice().sort((a, b) => a - b)
}

export default class ItemStore {
    constructor() {
        this._items = []
        this._brands = []
        this._brandsSet = []
        this._grips = []
        this._gripsSet = []
        this._bends = []
        this._bendsSet = []
        this._rigidities = []
        this._rigiditiesSet = []
        this._min = 0
        this._minSet = 0
        this._max = 100000
        this._maxSet = 100000
        this._page = 1
        this._limit = 18
        this._amount = 0
        makeAutoObservable(this)
    }

    async setItems(items) {
        if (items) {
            this._items = items.rows
            this._amount = items.count
        }
    }

    async setBrands(brands) {
        let newBrands = []
        for (let i of brands) {
            newBrands.push(i.brand)
        }
        this._brands = newBrands
    }

    async setBrandsSet(brands) {
        this._brandsSet = brands
    }

    async setGrips(grips) {
        let newGrips = []
        for (let i of grips) {
            newGrips.push(i.grip)
        }
        this._grips = newGrips
    }

    async setGripsSet(grips) {
        this._gripsSet = grips
    }

    async setBends(bends) {
        let newBends = []
        for (let i of bends) {
            newBends.push(i.bend)
        }
        this._bends = sortAscending(newBends)
    }

    async setBendsSet(bends) {
        this._bendsSet = bends
    }

    async setRigidities(rigidities) {
        let newRigidities = []
        for (let i of rigidities) {
            newRigidities.push(i.rigidity)
        }
        this._rigidities = sortAscending(newRigidities)
    }

    async setRigiditiesSet(rigidities) {
        this._rigiditiesSet = rigidities
    }

    async setMinSet(min) {
        this._minSet = min
    }

    async setMax(max) {
        this._max = max.minValue
        this._maxSet = max.minValue
    }

    async setMaxSet(max) {
        this._maxSet = max
    }

    async setPage(page) {
        this._page = page
    }

    async setAmount(amount) {
        this._amount = amount
    }

    get items() {
        return this._items
    }

    get brands() {
        return this._brands
    }

    get brandsSet() {
        return this._brandsSet
    }

    get grips() {
        return this._grips
    }

    get gripsSet() {
        return this._gripsSet
    }

    get bends() {
        return this._bends
    }

    get bendsSet() {
        return this._bendsSet
    }

    get rigidities() {
        return this._rigidities
    }

    get rigiditiesSet() {
        return this._rigiditiesSet
    }

    get min() {
        return this._min
    }

    get minSet() {
        return this._minSet
    }

    get max() {
        return this._max
    }

    get maxSet() {
        return this._maxSet
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    get amount() {
        return this._amount
    }
}