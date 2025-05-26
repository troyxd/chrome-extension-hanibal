(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            tabUpdated();
        }
    });

    const tabUpdated = () => {
        const submitBlock = document.getElementsByClassName("submit-block")[0];
        if (!submitBlock) return;

        const addBtnExists = document.getElementsByClassName("add-btn")[0];
        if (!addBtnExists) {
            createAddButton(submitBlock);
            createClearButton(submitBlock);
        }
    }

    const createAddButton = (parentElement) => {
        const addBtn = document.createElement("img");

        addBtn.src = chrome.runtime.getURL("assets/add.png");
        addBtn.className = "btn btn-fav add-btn";
        addBtn.title = "Click to add item to list";


        parentElement.append(addBtn);
        addBtn.addEventListener("click", addNewItemEventHandler);
    }

    const createClearButton = (parentElement) => {
        const clearBtn = document.createElement("img");

        clearBtn.src = chrome.runtime.getURL("assets/delete.png");
        clearBtn.className = "btn btn-fav clear-btn";
        clearBtn.title = "Click to clear the list";

        parentElement.append(clearBtn);

        clearBtn.addEventListener("click", () => {
            chrome.storage.sync.clear(() => {
                console.log("chrome sync storage cleared.");
            });
        });
    }

    // TODO: still doesnt work, tabUpdated() isn't called when hash changes and page is re-rendered
    const observeSubmitBlock = () => {
        const targetElement = document.getElementsByClassName("submit-block")[0];
        if (!targetElement) return;
        const observerConfig = {
            childList: true,    // watch for addition or removal of child elements to target element,
            subtree: true       // watch for changes in the entire subtree of the target element
        };
        const observer = new MutationObserver(() => {
            tabUpdated();
        });
        observer.observe(targetElement, observerConfig);
    };

    const addNewItemEventHandler = () => {

        const product = document.getElementsByClassName("main product-main")[0];
        const productName = product.querySelector("h1.h2").innerText;
        const priceString = product.querySelector("div.product-price-block>p").innerText.replace(/[^0-9,]/g, '');
        const priceStringWithDots = priceString.replace(',', '.');
        const productPrice = parseFloat(priceStringWithDots);
        const productDescription = product.querySelector("p.annotation").innerText;
        const productID = product.querySelector("div.product-code > div:nth-child(2)").innerText;

        const newProduct = {
            name: productName,
            desc: productDescription,
            price: productPrice,
            id: productID,
        };

        chrome.storage.sync.set({ [productID]: JSON.stringify(newProduct) });
    }

    tabUpdated();
    observeSubmitBlock();
})();
