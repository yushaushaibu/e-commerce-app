const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/product');
const { application } = require("express");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["h23vba9lo3a77"],
  })
);

app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log("Listening..");
});
