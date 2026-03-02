import { fetchParsedProductList, fetchProduct, getActiveTabURL } from "./utils.js";

const removeProduct = (productID) => {
  chrome.storage.sync.remove(productID, () => {
    console.log(`Removed product ${productID} from storage.`)
  })
  showStoredProducts();
  // TODO: resize popup
}

const editProduct = async (productID) => {
  const productObject = await fetchProduct(productID);
  if (Object.keys(productObject).length === 0) return;

  const productElement = document.getElementById(productID);
  const productValues = productElement.querySelector(".product-title");

  productValues.innerHTML = `
    <input class="brand-input" type="text" value="${productObject.brand}">
    <input class="name-input" type="text" value="${productObject.name}">
  `;

  const saveBtn = productElement.querySelector(".edit-btn");
  saveBtn.innerHTML = '<img src="assets/save.svg">';
  saveBtn.style = "background-color: #9ede87";
  saveBtn.addEventListener("click", () => {
    // TODO: this works but is kinda lagy for some reason
    productObject.brand = productValues.querySelector(".brand-input").value
    productObject.name = productValues.querySelector(".name-input").value
    chrome.storage.sync.set({ [productID]: JSON.stringify(productObject) })
    showStoredProducts();
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
      <button class="delete-btn btn"><img src="assets/delete.svg"></button>
      <button class="edit-btn btn"><img src="assets/edit.svg"></button>
    </div>
  `
  const deleteBtn = productElement.querySelector(".delete-btn")
  deleteBtn.addEventListener("click", () => {
    removeProduct(productObject.id)
  });

  const editBtn = productElement.querySelector(".edit-btn")
  editBtn.addEventListener("click", async () => {
    await editProduct(productObject.id)
  })

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
    return;
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

// EDIT: call showStoredProducts() menually instead of on each change
// re-render products when storage changes (when product is deleted)
// chrome.storage.onChanged.addListener(async () => {
//   await showStoredProducts();
// });

