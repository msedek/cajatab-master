export const calculateDecimal = monto => {
  let precio = monto;
  let precio2 = monto + 0.01;

  if (precio2 - precio < 0.05 && precio2 - precio < 0.49) {
    return parseInt(precio2, 10).toFixed(2);
  } else {
    return precio.toFixed(2);
  }
};
