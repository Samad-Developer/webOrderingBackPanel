export const orderObjectSetter = (orderArray = []) => {
  let arr = orderArray.map((item) => ({
    OrderMasterId: item.OrderMasterId || null,
    ProductDetailId: item.ProductDetailId || null,
    PriceWithoutGST: item.PriceWithoutGST || 0,
    GSTId: item.GSTId || null,
    PriceWithGST: item.PriceWithGST || 0,
    OrderParentId: item.OrderParentId || null,
    Quantity: item.Quantity || "",
    SpecialInstruction: item.SpecialInstruction || "",
    DiscountPercent: item.DiscountPercent || 0,
    DealItemId: item.DealItemId || null,
    DealDescId: item.DealDescId || null,
    RandomId: item.RandomId || null,
    IsTopping: item.IsTopping || false,
    HalfAndHalf: item.HalfAndHalf || false,
    ProductDetailPropertyId: item.ProductDetailPropertyId || null,
    ProductPropertyId: item.ProductPropertyId || null,
  }));
  return arr;
};
