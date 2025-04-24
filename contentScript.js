(() => {
    let submitButtons;
    let currentProducts = [];
    let storageKey = "key";
    // TODO - save info about each product in storage using the product id from the URL as a key (should help with easier removing of products later)
    let productID;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            tabUpdated();
        }
    });

    const fetchProductList = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([storageKey], (data) => {
                resolve(data[storageKey] ? JSON.parse(data[storageKey]) : [])
            })
        })
    }

    const tabUpdated = () => {
        const addBtnExists = document.getElementsByClassName("add-btn")[0];

        if (!addBtnExists) {
            const addBtn = document.createElement("img");

            addBtn.src = chrome.runtime.getURL("assets/add.png");
            addBtn.className = "btn btn-fav add-btn";
            addBtn.title = "Click to add item to list";

            submitButtons = document.getElementsByClassName("submit-block")[0];

            submitButtons.append(addBtn);
            addBtn.addEventListener("click", addNewItemEventHandler);
            // chrome.storage.sync.clear(() => {
            //     console.log("chrome sync storage cleared.")
            // })
        }
    }

    const addNewItemEventHandler = async () => {

        const product = document.getElementsByClassName("main product-main")[0];
        const productName = product.querySelector("h1.h2").innerText;
        const priceString = product.querySelector("div.product-price-block>p").innerText.replace(/[^0-9,]/g, '');
        const priceStringWithDots = priceString.replace(',', '.');
        const productPrice = parseFloat(priceStringWithDots);
        const productDescription = product.querySelector("p.annotation").innerText;

        const newProduct = {
            name: productName,
            desc: productDescription,
            price: productPrice
        };

        currentProducts = await fetchProductList();
        currentProducts.push(newProduct);

        chrome.storage.sync.set({ [storageKey]: JSON.stringify(currentProducts) }).then(() => {
            fetchProductList().then((data) => {
                console.log(data);
            });
        });
    }

    tabUpdated();
})();
