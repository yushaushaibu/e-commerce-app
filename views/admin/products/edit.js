const layout = require("../layout");

module.exports = ({ product }) => {
  return layout({
    content: `
            <form method="POST">
                <input type="text" name="product" value="${product.product}" />
                <input type="text" name="price" value="${product.price}" />
                <button>Submit</button>
            </form>
        `,
  });
};
