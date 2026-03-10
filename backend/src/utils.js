import { Order, Product } from './models.js'


export async function getTopProducts() {
    const orders = await Order.find()
    const topProducts = {}

    for (const order of orders) {
        for (const product of order.products) {
            const { id, quantity } = product

            if (!topProducts[id]) {
                topProducts[id] = 0
            }

            topProducts[id] += quantity
        }
    }
    return Object.entries(topProducts)
        .sort(([, v1], [, v2]) => v2 - v1)
        .reduce((acc, [k, v]) => {
            acc[k] = v  
            return acc
        }, {})
} 

export async function getProductPrice(id) {
    return (await Product.findById(id)).price
}

export async function getRevenue() {
    const orders = await Order.find()
    let totalRevenue = 0

    for (const order of orders) {
        for (const product of order.products) {
            const { product: id, quantity } = product
            const productPrice = await getProductPrice(id)

            totalRevenue += productPrice * quantity
        }
    }
    return totalRevenue
}