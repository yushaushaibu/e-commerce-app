const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const { requireAuth } = require("./middleware");
const productsRepo = require("../../repositories/products");
const newProductTemplate = require("../../views/admin/products/newProduct");
const productsIndexTemplate = require("../../views/admin/products/index");
const productEditTemplate = require("../../views/admin/products/edit");
const { requireProduct, requirePrice } = require("./validators");
const users = require("../../repositories/users");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProductTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireProduct, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(newProductTemplate({ errors }));
    }

    const image = req.file.buffer.toString("base64");
    const { product, price } = req.body;
    await productsRepo.create({ product, price, image });

    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);

  if (!product) {
    return res.send("Product not found");
  }

  res.send(productEditTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  [requireProduct, requirePrice],
  upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(productEditTemplate({ errors }));
    }

    const changes = req.body;
    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }

    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      res.send("Could not find product");
    }

    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id);

  res.redirect("/admin/products");
});

module.exports = router;
