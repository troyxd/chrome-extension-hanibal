import { fetchParsedProductList } from "./utils.js";

const createLabel = (product) => {
  const label = document.createElement("div")

  label.className = "label"
  label.innerHTML = `
    <h1 class="product-brand">${product.brand}</h1>
    <h2 class="product-name">${product.name}</h2>
    <p class="product-description">${product.desc}</p>
    <p class="product-price">${product.price}</p>
  `
  const labelGrid = document.getElementById("label-grid");

  labelGrid.appendChild(label)
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
