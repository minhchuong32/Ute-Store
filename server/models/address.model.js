import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    address_line : {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String
    },
    country: {
        type: String,
    },
    mobile: {
        type: Number,
        default: null
    },
}, {
    timestams: true // tự động thêm createdAt và updatedAt vào schema
})

const AddressModel = mongoose.model('address', addressSchema) // address là tên của collection trong MongoDB

export default AddressModel