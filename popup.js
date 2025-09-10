import { fetchParsedProductList, getActiveTabURL } from "./utils.js";

const removeProduct = (productID) => {
    chrome.storage.sync.remove(productID, () => {
        console.log(`Removed product ${productID} from storage.`)
    })
}

const createProductElement = (productsContainer, productObject) => {
    const productElement = document.createElement("div");
    productElement.className = "product-item";
    productElement.id = productObject.id;

    const nameElement = document.createElement("div");
    nameElement.innerText = productObject.name;
    nameElement.className = "product-name";

    const priceElement = document.createElement("div");
    priceElement.innerText = `${productObject.price} Kč`;
    priceElement.className = "product-price";

    const deleteBtn = document.createElement("img");
    deleteBtn.src = "assets/delete.svg";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
        removeProduct(productObject.id)
    });

    productElement.appendChild(nameElement);
    productElement.appendChild(priceElement);
    productElement.appendChild(deleteBtn);

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
        const title = document.getElementsByTagName("h1")[0];
        title.innerText = "Not on hanibal.cz";
        return;
    }
    await showStoredProducts();
});

// re-render popup when storage changes (when product is deleted)
chrome.storage.onChanged.addListener(async () => {
    await showStoredProducts();
});
