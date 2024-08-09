const express = require("express");
const router = express.Router();

const MenuItem = require("../models/MenuItem");

// POST route for creating or editing a menu item
router.post("/", async (req, res) => {
  try {
    const { id, name, price, taste, is_drink, ingredients, num_sales } =
      req.body;

    if (id) {
      // Edit existing menu item
      const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        id,
        { name, price, taste, is_drink, ingredients, num_sales },
        { new: true, runValidators: true } // Return the updated document and validate it
      );

      if (updatedMenuItem) {
        console.log("Menu item updated");
        res.status(200).json(updatedMenuItem);
      } else {
        res.status(404).json({ error: "Menu item not found" });
      }
    } else {
      // Create new menu item
      const newMenuItem = new MenuItem({
        name,
        price,
        taste,
        is_drink,
        ingredients,
        num_sales,
      });
      const response = await newMenuItem.save();

      console.log("Menu item created");
      res.status(201).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch all menu items
router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("Menu fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch menu items by taste
router.get("/:taste", async (req, res) => {
  try {
    const itemTaste = req.params.taste;
    // Validate the taste parameter
    if (["Sweet", "Spicy", "Sour"].includes(itemTaste)) {
      const data = await MenuItem.find({ taste: itemTaste });
      console.log("Menu fetched");
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Invalid taste" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route to delete a menu item by ID
router.delete("/:id", async (req, res) => {
  try {
    const MenuId = req.params.id;
    const response = await MenuItem.findByIdAndDelete(MenuId);
    console.log("Menu deleted");
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//export
module.exports = router;
