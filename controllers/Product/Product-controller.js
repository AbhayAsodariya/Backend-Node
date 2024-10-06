const { Product, AddToCart, Order } = require("../../models/Product/Product");

// Create a global product
const createGlobalProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get all global products
const getGlobalProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Add product to cart
const createAddToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const skuItem = product.skus.find(s => s.sku === sku);
    if (!skuItem) return res.status(404).json({ message: "SKU not found" });

    if (skuItem.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Decrease SKU quantity
    skuItem.quantity -= quantity;
    await product.save();

    const newCartItem = await AddToCart.create({
      product: id,
      sku,
      quantity,
      createdBy: userId
    });

    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart", error });
  }
};

// Edit product using POST
const editProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

// Controller functions
const getProductOptions = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return product details and options, including quantity and price for each SKU
    res.status(200).json({
      productId: product._id,
      name: product.name,
      options: product.options,
      existingSKUs: product.skus.map(sku => ({
        sku: sku.sku,
        optionValues: sku.optionValues,
        quantity: sku.quantity,  // Include quantity
        price: sku.price  // Include price
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product options", error });
  }
};


const createSKUFromOptions = async (req, res) => {
  try {
    const { productId } = req.params;
    const { optionValues, quantity, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate all required options are provided
    const missingOptions = product.options
      .map(option => option.name)
      .filter(optionName => !optionValues[optionName]);

    if (missingOptions.length > 0) {
      return res.status(400).json({
        message: "Missing option values",
        missingOptions
      });
    }

    // Validate option values
    const invalidOptions = [];
    for (const [optionName, value] of Object.entries(optionValues)) {
      const option = product.options.find(opt => opt.name === optionName);
      if (!option || !option.values.includes(value)) {
        invalidOptions.push({
          optionName,
          providedValue: value,
          allowedValues: option ? option.values : []
        });
      }
    }

    if (invalidOptions.length > 0) {
      return res.status(400).json({
        message: "Invalid option values provided",
        invalidOptions
      });
    }

    // Check if SKU with these options already exists
    const existingSku = product.skus.find(sku =>
      Object.entries(optionValues).every(([key, value]) =>
        sku.optionValues[key] === value
      )
    );

    if (existingSku) {
      // Replace the quantity and price of the existing SKU
      existingSku.quantity = quantity; // Replace existing quantity
      existingSku.price = price; // Replace the price
      await product.save();

      return res.status(200).json({
        message: "SKU updated successfully",
        sku: existingSku
      });
    }

    // If SKU does not exist, create a new one
    const skuString = Object.entries(optionValues)
      .map(([_, value]) => value.substring(0, 2).toUpperCase())
      .join('-');
    const uniqueSku = `${product.name.substring(0, 2).toUpperCase()}-${skuString}`;

    const newSKU = {
      sku: uniqueSku,
      quantity,
      price,
      optionValues
    };

    product.skus.push(newSKU);
    await product.save();

    res.status(201).json({
      message: "SKU created successfully",
      sku: newSKU
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating or updating SKU", error });
  }
};


// Get all SKUs for a product
const getSKUsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product.skus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching SKUs", error });
  }
};

// Get all available products (products with SKUs having quantity > 0)
const getAvailableProducts = async (req, res) => {
  try {
    const availableProducts = await Product.find({
      "skus": { $elemMatch: { "quantity": { $gt: 0 } } }
    });
    res.status(200).json(availableProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available products", error });
  }
};

// Create an order
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    let totalAmount = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      const sku = product.skus.find(s => s.sku === item.sku);
      if (!sku) {
        return res.status(404).json({ message: `SKU ${item.sku} not found for product ${item.product}` });
      }

      if (sku.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for SKU ${item.sku}` });
      }

      sku.quantity -= item.quantity;
      await product.save();

      totalAmount += sku.price * item.quantity;
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

module.exports = {
  createGlobalProduct,
  createAddToCart,
  editProduct,
  deleteProduct,
  getGlobalProducts,
  getProductById,
  getProductOptions,
  createSKUFromOptions,
  getSKUsForProduct,
  getAvailableProducts,
  createOrder
};