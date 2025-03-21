export const calculateCartTotals=(cartItems,quantities)=>{
    
  const subTotal = cartItems.reduce(
    (acc, food) => acc + food.price * quantities[food.id],
    0
  );
  const shipping = subTotal == 0 ? 0.0 : 10.0;
  const tax = subTotal * 0.1;
  const Total = shipping + subTotal + tax;
  return {subTotal,shipping,tax,Total}
}