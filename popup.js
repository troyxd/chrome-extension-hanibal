import { fetchParsedProductList } from "./utils.js";

const createProductElement = (productsContainer, productObject) => {
    const productElement = document.createElement("div");
    productElement.className = "product-item";
    productElement.id = productObject.id;

    const nameElement = document.createElement("h2");
    nameElement.innerText = productObject.name;

    const priceElement = document.createElement("p");
    priceElement.innerText = `${productObject.price} Kč`;

    const descElement = document.createElement("p");
    descElement.innerText = productObject.desc;

    productElement.appendChild(nameElement);
    productElement.appendChild(priceElement);
    productElement.appendChild(descElement);

    productsContainer.appendChild(productElement);
}

const showStoredProducts = async () => {
    const productsList = await fetchParsedProductList();
    const productContainer = document.getElementById("products");
    productContainer.innerHTML = ""; // Clear previous products
    for (const [key, product] of Object.entries(productsList)) {
        createProductElement(productContainer, product);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await showStoredProducts(); // Show products on popup load
});

// re-render popup when storage changes (when product is deleted)
chrome.storage.onChanged.addListener(async () => {
    await showStoredProducts(); // Update products when storage changes
});
