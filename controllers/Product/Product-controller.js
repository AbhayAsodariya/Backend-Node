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

// Get product options
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

// Create SKU from options
const createSKUFromOptions = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from URL parameters
    const { optionValues, quantity, price } = req.body; // Get optionValues, quantity, and price from request body

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate that all required options are provided in optionValues
    const missingOptions = product.options
      .map(option => option.name)
      .filter(optionName => !optionValues[optionName]);

    if (missingOptions.length > 0) {
      return res.status(400).json({
        message: "Missing option values",
        missingOptions
      });
    }

    // Validate that provided option values are valid
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

    // Generate the SKU string based on option values
    const skuString = Object.entries(optionValues)
      .map(([_, value]) => value.substring(0, 2).toUpperCase())
      .join('-');
    const uniqueSku = `${product.name.substring(0, 2).toUpperCase()}-${skuString}`;

    // Check if SKU with the generated SKU string already exists in the current product
    const existingSku = product.skus.find(sku => sku.sku === uniqueSku);

    if (existingSku) {
      // If SKU exists, update its quantity and price
      existingSku.quantity += quantity; // Add to existing quantity
      existingSku.price = price; // Update the price
      await product.save(); // Save the updated product

      return res.status(200).json({
        message: "SKU updated successfully",
        sku: existingSku
      });
    }

    // If SKU doesn't exist, create a new one
    const newSKU = {
      sku: uniqueSku,
      quantity,
      price,
      optionValues
    };

    // Add the new SKU to the product's skus array
    product.skus.push(newSKU);
    await product.save(); // Save the product with the new SKU

    res.status(201).json({
      message: "SKU created successfully",
      sku: newSKU
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: "Error creating or updating SKU", error });
  }
};


// Get cart items for the logged-in user
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in req.user after authentication

    // Fetch items from the AddToCart collection for the user
    const cartItems = await AddToCart.find({ createdBy: userId })
      .populate('product', 'name imgUrl price') // Populate product details
      .exec();

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Calculate total price for the cart
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);

    res.status(200).json({
      items: cartItems,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart items", error });
  }
};


module.exports = {
  createGlobalProduct,
  getGlobalProducts,
  createAddToCart,
  editProduct,
  deleteProduct,
  getProductById,
  getProductOptions,
  createSKUFromOptions,
  getCartItems
};
