export const saleReturnPromise = (barcodeValue, updatedProducts) => {
  const _index = updatedProducts.findIndex(
    (item) =>
      item.ProductCode == barcodeValue &&
      item.RemainingQty > item.SaleReturnQuantity,
  );

  if (_index > -1) {
    updatedProducts[_index].SaleReturnQuantity =
      updatedProducts[_index].SaleReturnQuantity + 1;
    return updatedProducts;
  } else {
    return 'Product Code not found!';
  }
};
