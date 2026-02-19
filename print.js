import { fetchParsedProductList } from "./utils.js";

const printProduct = async (product) => {
  // TODO: format the productDiv
  const productDiv = document.createElement("div");
  productDiv.id = product.id

  const header = document.createElement("h1")
  header.innerText = product.name
  productDiv.appendChild(header)

  const description = document.createElement("p")
  description.innerText = product.desc
  productDiv.appendChild(description)

  const price = document.createElement("p")
  price.innerText = product.price
  productDiv.appendChild(price)

  content.appendChild(productDiv)
}

const printProducts = async () => {
  const productList = await fetchParsedProductList();

  for (const product of Object.values(productList)) {
    printProduct(product);
  }
}


printProducts();
window.print();
