import { fetchParsedProductList, getActiveTabURL } from "./utils.js";

const removeProduct = (productID) => {
  chrome.storage.sync.remove(productID, () => {
    console.log(`Removed product ${productID} from storage.`)
  })
}

const createProductElement = (productsContainer, productObject) => {
  const productElement = document.createElement("div");
  productElement.className = "product-container";
  productElement.id = productObject.id;

  productElement.innerHTML = `
    <div class="product-title">
      <div class="brand-name">${productObject.brand}</div>
      <div class="product-name">${productObject.name}</div>
    </div>
    <div class="product-price">${productObject.price}</div>
    <div class="product-actions">
      <img class="delete-btn btn" src="assets/delete.svg">
      <img class="edit-btn btn" src="assets/edit.svg">
    </div>
  `
  const deleteBtn = productElement.querySelector(".delete-btn")
  deleteBtn.addEventListener("click", () => {
    removeProduct(productObject.id)
  });

  productsContainer.appendChild(productElement);
}

const showStoredProducts = async () => {
  const productContainer = document.getElementById("products");
  productContainer.innerHTML = ""; // Clear previous products

  const productsList = await fetchParsedProductList();
  const productsIDs = Object.keys(productsList);
  if (productsIDs.length === 0) {
    productContainer.innerText = "No products stored.";
    return;
  }
  for (const id of productsIDs) {
    createProductElement(productContainer, productsList[id]);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  if (!activeTab.url.includes("hanibal.cz")) {
    // clear buttons
    buttons.innerHTML = ""
    products.innerHTML = ""
    const title = document.getElementsByTagName("h1")[0];
    title.innerText = "Not on hanibal.cz";
    return;
  }
  await showStoredProducts();
  renderPrintButton()
});

const printProducts = async () => {
  const products = await fetchParsedProductList();

  if (Object.keys(products).length === 0) {
    console.log("no products to print")
    return
  }

  chrome.tabs.create({ url: "print.html" })
}

const renderPrintButton = () => {
  const printButton = document.createElement("button");
  printButton.id = "printButton";
  printButton.innerText = "Print";
  printButton.addEventListener("click", async () => printProducts())

  buttons.appendChild(printButton);
}

// re-render products when storage changes (when product is deleted)
chrome.storage.onChanged.addListener(async () => {
  await showStoredProducts();
  // TODO: resize popup
});

// TODO: add button to create page to print all stored products
