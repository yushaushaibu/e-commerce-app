module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => {
      return `
            <li>${product.product} - ${product.price} </li>
        `;
    })
    .join("");

  return `
    <ul>
        ${renderedProducts}
    </ul>
    `;
};
