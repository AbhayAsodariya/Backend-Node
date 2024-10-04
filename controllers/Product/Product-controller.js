const { Product, SKU } = require("../../models/Product/Product");

// Create SKU
const createSKU = async (req, res) => {
  try {
    const newSKU = new SKU(req.body);
    const savedSKU = await newSKU.save();
    res.status(201).json(savedSKU);
  } catch (error) {
    res.status(500).json({ message: "Error creating SKU", error });
  }
};

// Edit SKU (Category and Options)
const editSKU = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, options } = req.body;

    const updatedSKU = await SKU.findByIdAndUpdate(
      id,
      { category, options },
      { new: true, runValidators: true }
    );

    if (!updatedSKU) {
      return res.status(404).json({ message: "SKU not found" });
    }

    res.status(200).json({
      message: "SKU updated successfully",
      updatedSKU,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating SKU", error });
  }
};

// Create a global product
const createGlobleProduct = async (req, res) => {
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
    const userId = req.user.id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newProduct = await ProductAddToCart.create({
      ...product.toObject(),
      createdBy: userId,
    });

    res.status(201).json(newProduct);
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

module.exports = {
  createGlobleProduct,
  createAddToCart,
  editProduct,
  deleteProduct,
  getGlobalProducts,
  getProductById,
  createSKU,  // Exporting SKU creation
  editSKU    // Exporting SKU editing
};
