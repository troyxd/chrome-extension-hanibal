import { fetchParsedProductList } from "./utils.js";

const labelGrid = document.getElementById("label-grid")

const createLabel = (product) => {
  const label = document.createElement("div")

  label.className = "label"
  label.innerHTML = `
    <h1 class="brand-name title">${product.brand}</h1>
    <h2 class="product-name title">${product.name}</h2>
    <div class="desc-section">
      <p class="product-desc">${product.desc}</p>
    </div>
    <footer class="label-footer">
      <img src="assets/logo.png" class="shop-logo"></img>
      <span class="product-price">${product.price.toFixed(0)},-</span>
    </footer>
  `

  labelGrid.appendChild(label)
}

// get products from storage
const productList = await fetchParsedProductList();

// clear existing labels
labelGrid.innerHTML = "";

for (const product of Object.values(productList)) {
  createLabel(product);
}

window.print();
