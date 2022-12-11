const layout = require("../layout");

module.exports = ({ product }) => {
  return layout({
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Edit a Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Product</label>
              <input type="text" placeholder="Product" name="product" value="${product.product}" />
            </div>

            <div class="field">
              <label class="label">Price</label>
              <input value="${product.price}" class="input" placeholder="Price" name="price" />
            </div>

            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
            </div>
            <br />

            <button class="button is-primary">Edit</button>
          </form>
        </div>
      </div>
`,
  });
};
