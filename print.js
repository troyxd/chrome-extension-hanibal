import { fetchParsedProductList } from "./utils.js";

const createLabel = (product) => {
  const label = document.createElement("div")

  label.className = "label"
  label.innerHTML = `
    <div>
      <h1 class="product-brand">${product.brand}</h1>
      <h2 class="product-name">${product.name}</h2>
      <p class="product-description">${product.desc}</p>
      <p class="product-price">${product.price}</p>
    </div>
  `

  document.body.appendChild(label)
}

// get products from storage
const productList = await fetchParsedProductList();

const existingLabelIds = []

for (const child of document.body.children) {
  existingLabelIds.push(child.id)
}

for (const product of Object.values(productList)) {
  createLabel(product);
}

window.print();
