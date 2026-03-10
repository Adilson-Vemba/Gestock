import mongoose from "mongoose";
import moment from "moment-timezone";

const { connect, Schema, model, models } =  mongoose;

connect(process.env.DB_URL)

function convertDate(date) {
    return moment(date).tz("Africa/Luanda").format()
}

mongoose.plugin((schema) => {
    schema.set("toJSON", {
        transform: (_, ret) => {
            if (ret.createdAt) {
                ret.createdAt = convertDate(ret.createdAt)
            }

            if (ret.updatedAt) {
                ret.updatedAt = convertDate(ret.updatedAt)
            }

            return ret
        }
    })
})
const productSchema = new Schema({
    code: { type: Schema.Types.ObjectId, auto: true}, 
    name: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String },
    quantity: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

const orderSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, min: 1}
        }
    ]
}, { timestamps: true, versionKey: false })

const invoiceSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },  
}, { timestamps: true, versionKey: false })

const supplierSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true, versionKey: false })

const supplierRequestSchema = new Schema({
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    products:[
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, min: 1 },
        }
    ],
    status: { 
        type: String, 
        enum: ["PENDENTE", "ACEITE", "RECUSADO"], 
        default: "PENDENTE" 
    },
}, { timestamps: true, versionKey: false});

export const Order = model('Order', orderSchema)
export const Invoice = model('Invoice', invoiceSchema)
export const Product = model('Product', productSchema)
export const Supplier = model('Supplier', supplierSchema)
export const SupplierRequest = model("SupplierRequest", supplierRequestSchema)