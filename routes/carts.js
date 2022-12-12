const express = require("express");
const cartsRepo = require("../repositories/carts");
const products = require("../repositories/products");
const productsRepo = require("../repositories/products");
const showCartTemplate = require("../views/carts/show");
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

  res.redirect("/cart");
});

// GET request to show all items in cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    // item === { id: , quantity: }
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }

  res.send(showCartTemplate({ items: cart.items }));
});

// DELETE request to remove item from a cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });

  res.redirect("/cart");
});

module.exports = router;
