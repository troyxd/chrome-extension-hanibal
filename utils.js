export async function getActiveTabURL() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  // [tab] gets first element of the array returned by query
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


export async function fetchParsedProductList() {
  const productsData = await chrome.storage.sync.get(null);
  // parse all stored products from JSON strings to objects
  Object.keys(productsData).forEach(key => {
    productsData[key] = JSON.parse(productsData[key]);
  });
  return productsData;
}


export async function fetchProduct(productID) {
  const productData = await chrome.storage.sync.get(productID);
  return productData[productID] ? JSON.parse(productData[productID]) : {};
}
