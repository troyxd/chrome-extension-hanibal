(() => {
  chrome.runtime.onMessage.addListener((message, sender, _response) => {
    if (message.type === "NEW") {
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

    addBtn.src = chrome.runtime.getURL("assets/add.png");
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
      // Add a small delay to ensure DOM is fully updated
      setTimeout(tabUpdated, 100);
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
  setupGlobalObserver();

  // Also watch for hash changes and popstate events
  // idk if this is needed
  window.addEventListener('hashchange', () => {
    setTimeout(tabUpdated, 100);
  });

  window.addEventListener('popstate', () => {
    setTimeout(tabUpdated, 100);
  });

  // TODO: this is propably redundant but leaving it for now
  // Fallback: periodic check every 3 seconds to ensure buttons stay on page
  setInterval(() => {
    const submitBlock = document.querySelector(".submit-block");
    const addBtnExists = submitBlock && submitBlock.querySelector(".add-btn");
    if (submitBlock && !addBtnExists) {
      console.log("Periodic check: buttons missing, re-adding...");
      tabUpdated();
    }
  }, 3000);
})();
