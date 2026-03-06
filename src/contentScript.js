(() => {
  chrome.runtime.onMessage.addListener((message, _sender, _response) => {
    if (message.type === "NEW") {
      console.log("Message NEW recieved")
      tabUpdated();
    }
  });

  const tabUpdated = () => {
    const submitBlockExists = document.querySelector(".submit-block")

    if (!submitBlockExists) {
      return;
    }

    const addBtnExists = submitBlockExists.querySelector(".add-btn");
    if (!addBtnExists) {
      createAddButton(submitBlockExists);
    } else {
      console.log("Buttons already exist, skipping creation");
    }
  }

  const createAddButton = (parentElement) => {
    console.log("Adding add button to submit block");
    const addBtn = document.createElement("img");

    addBtn.src = chrome.runtime.getURL("assets/add.svg");
    addBtn.className = "btn btn-fav add-btn";
    addBtn.title = "Click to add item to list";


    parentElement.append(addBtn);
    addBtn.addEventListener("click", addNewItemEventHandler);
  }

  const handleMutations = (mutations) => {
    let shouldUpdate = false;

    mutations.forEach((mutation) => {
      // Check if submit-block or its children were modified
      if (mutation.target.classList &&
        (mutation.target.classList.contains('submit-block') ||
          mutation.target.closest('.submit-block'))) {
        shouldUpdate = true;
      }

      // Check if any added nodes contain or are the submit-block
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && node.classList.contains('submit-block') ||
            node.querySelector && node.querySelector('.submit-block')) {
            shouldUpdate = true;
          }
        }
      });
    });

    if (shouldUpdate) {
      tabUpdated();
    }
  }

  // Global observer to watch for DOM changes
  let globalObserver = null;

  const setupGlobalObserver = () => {
    // Disconnect existing observer if any
    if (globalObserver) {
      globalObserver.disconnect();
    }

    const observerConfig = {
      childList: true,    // watch for addition or removal of child elements
      subtree: true,      // watch for changes in the entire subtree
      attributes: false   // don't watch for attribute changes to reduce noise
    };

    globalObserver = new MutationObserver(handleMutations);

    // Observe the entire document body to catch all changes
    globalObserver.observe(document.body, observerConfig);
  };

  const parseNameFromProductTitle = (title, brandName) => {
    if (typeof title != 'string' && !(title instanceof String)) {
      return { name: '', brand: '' };
    }

    const index = title.indexOf(brandName);
    if (index === -1) {
      // brand name not found in title, return the whole title as name
      return title;
    }

    return title.substring(index + brandName.length + 1);
  }

  const addNewItemEventHandler = () => {

    const product = document.getElementsByClassName("main product-main")[0];

    const productTitle = product.querySelector("h1.h2").innerText;
    const productBrand = product.querySelector("#tabs-2 .producer-name").innerText;
    const productName = parseNameFromProductTitle(productTitle, productBrand);

    const priceString = product.querySelector("div.product-price-block>p").innerText.replace(/[^0-9,]/g, '');
    const productPrice = parseFloat(priceString.replace(',', '.'));
    const productPriceDMOCElement = product.querySelector(".product-price-dmoc")
    const productPriceDMOC = productPriceDMOCElement
      ? parseFloat(productPriceDMOCElement.innerText.replace(/[^0-9,]/g, '').replace(',', '.'))
      : null;

    const productDescription = product.querySelector("p.annotation").innerText;
    const productID = product.querySelector("div.product-code > div:nth-child(2)").innerText;

    const newProduct = {
      name: productName,
      brand: productBrand,
      desc: productDescription,
      price: productPrice,
      priceDMOC: productPriceDMOC,
      id: productID,
    };

    chrome.storage.sync.set({ [productID]: JSON.stringify(newProduct) });
  }

  setupGlobalObserver();
  tabUpdated();
})();
