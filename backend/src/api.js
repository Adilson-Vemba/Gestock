import fs from 'fs';
import express from 'express';
import multer from 'multer';
import path from "path";

import { Product, Order, Invoice, Supplier, SupplierRequest } from './models.js';
import { serve, setup } from 'swagger-ui-express' 

import swaggerDocument from './swagger.json' with { type: "json" }


const UPLOAD_PATH = './uploads';

if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH, { recursive: true });

const uploadDir = path.resolve("uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const app = express();

app.use(express.json()); 
app.use("/api-docs", serve, setup(swaggerDocument))

const upload = multer({ storage })

Product.findByCode = (code) => {
  return Product.findOne({ code: code });
};

app.post("/products", upload.single("photo"), async (req, res) => {
  try {
    const { name, price, quantity: productQuantity } = req.body
    const photoPath = req.file ? req.file.path : null
    
    if (!name || !price) {
        return res.status(400).json({ error: "Nome e preço são obrigatórios" })
    }
    
    if (price <= 0) {
        return res.status(400).json({ error:  "Preço deve ser maior que 0" })
    }
    
    const product = await Product.create({
        name,
        price,
        quantity: productQuantity ? productQuantity : 0,
        photo: photoPath
    })
    
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.get("/products/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const product = await Product.findByCode(code)
    
    if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error })
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.patch("/products/:code", upload.single("photo"), async (req, res) => {
  try {
    const { code } = req.params
    const product = await Product.findByCode(code)

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" })
    }

    Object.keys(req.body).forEach(field => {
      product[field] = req.body[field]
    });

    if (req.file) {
      product.photo = req.file.path
    }

    await product.save()

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: `${error}` })
  }
})

app.post("/orders", async (req, res) => {
  try {
    const { products } = req.body

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Nenhum produto foi informado"})
    }

    let orderProducts = []

    for (const product of products) {
      const { code, quantity: OrderQuantity } = product
      
      if (OrderQuantity <= 0) {
        return res.status(400).json({ error: "Insira a quantidade mínima"})
      }

      const foundProduct = await Product.findByCode(code)
      
      if (!foundProduct) {
        return res.status(404).json({ error: "Produto não encontrado" })
      }
      
      if (foundProduct.quantity <= 0) {
        return res.status(400).json({ error: `Produto esgotado (${foundProduct.name})` })
      }
      
      if (foundProduct.quantity < OrderQuantity) {
        return res.status(400).json({ error: `Estoque é insuficiente (${foundProduct.name} -> ${foundProduct.quantity})` })
      }
      
      foundProduct.quantity -= OrderQuantity  
      await foundProduct.save()

      orderProducts.push({
        product: foundProduct._id,
        quantity: product.quantity
      })
    }
      
    const order = await Order.create({ products: orderProducts })
    const invoice = await (await Invoice.create({ order: order._id })).populate({
        path: 'order',
        populate: { path: 'products.product' }
    })  

    res.json({ invoice })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find() 
      .select("-createdAt")
      .populate({
        path: "products.product"
      })

    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
      .populate({
        path: "products.product"
      })

    if (!order) {
      return res.status(404).json({ error: "Ordem não encontrada" })
    }

    res.json({ order })
  } catch (error) {
    res.status(500).json({ error})
  }
})

app.post("/suppliers", async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ error: "Nome do fornecedor" })
    }

    const supplier = await Supplier.create({ name, description })

    res.json(supplier)
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find()

    res.json({ suppliers })
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.patch("/suppliers/:id", async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await Supplier.findById(id)

    if (!supplier) {
      return res.status(404).json({ error: "Fornecedor não encontrado" })
    }

    Object.keys(req.body).forEach(field => {
      supplier[field] = req.body[field]
    })

    await supplier.save()

    res.json(supplier)
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.post("/suppliers/:id/request", async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await Supplier.findById(id)

    if (!supplier) {
      return res.status(404).json({ error: "Fornecedor nao encontrada" })
    }

    const { products } = req.body

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Nenhum produto informado" })
    }

    let requestedProducts = []

    for (const product of products) {
      const { code, quantity } = product

      if (quantity <= 0) {
        return res.status(400).json({ error: "Informe uma quantidade válida" })
      }

      const foundProduct = await Product.findByCode(code)

      if (!foundProduct) {
        return res.status(404).json({ error: "Produto não encontrado" })
      }

      requestedProducts.push({
        product: foundProduct._id,
        quantity
      })
    }
    
    const supplierRequest = await SupplierRequest.create({
      supplier: supplier._id,
      products: requestedProducts
    })

    res.json(await (await supplierRequest.populate({
      path: "supplier",
    })).populate({ path: "products.product" }))
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.get("/suppliers/history", async (req, res) => {
  try {    
    const { status } = req.query
    const supplierRequests = await SupplierRequest
      .find(status ? { status: status.toUpperCase() } : {})
      .sort({ createdAt: -1 })

    res.json({ supplierRequests })
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.patch("/suppliers/change-request-status/:id", async (req, res) => {
  try {
    const { id } = req.params
    let { status } = req.body
    const supplierRequest = await SupplierRequest.findById(id) 
    
    if (!supplierRequest) {
      return res.status(404).json({ error: "Pedido não encontrado" })
    }
    
    if (!status || !["ACEITE", "RECUSADO"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" })
    }

    if (supplierRequest.status !== "PENDENTE") {
      return res.status(400).json({ error: "Status já foi definido" })
    }
    
    status = status.toUpperCase()
    supplierRequest.status = status
    await supplierRequest.save()
    
    if (supplierRequest.status === "ACEITE") {
      for (const product of supplierRequest.products) {
        const { product: id, quantity } = product
        
        const foundProduct = await Product.findById(id)
        foundProduct.quantity += quantity

        await foundProduct.save()
      }
    }
    
    res.json({ supplierRequest })
  } catch (error) {
    res.json({ error: `${error}` })
  }
})

app.get("/stats/graph", async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      { 
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { 
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          totalQuantity: 1
        }
      }
    ]);

    const sales = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$product.price"] }
          }
        }
      }
    ]);

    const totalRevenue = sales[0]?.totalRevenue || 0;

    const purchases = await SupplierRequest.aggregate([
      { $match: { status: "ACEITE" } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          totalSpent: {
            $sum: { $multiply: ["$products.quantity", "$product.price"] }
          }
        }
      }
    ]);

    const totalSpent = purchases[0]?.totalSpent || 0;

    res.json({
      topProducts,
      totalRevenue,
      totalSpent
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});