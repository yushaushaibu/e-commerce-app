const express = require("express");
const cartsRepo = require("../repositories/carts");
const { post } = require("./product");

const router = express.Router();

// POST request to add item to a cart
router.post("/cart/products", async (req, res) => {
  // Figure out cart
  let cart;
  if (!req.session.cartId) {
    /** We don't have a cart, we need to create one
     * and store the cart id on req.session.cartId property
     */
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart, let's get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  // Either add new item or add existing item to cart
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  console.log(cart);
  res.send("Product Added to Cart");
});

// GET request to show all items in cart

// DELETE request to remove item from a cart

module.exports = router;
