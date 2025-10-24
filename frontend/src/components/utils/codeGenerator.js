// cartUtils.js
export function generateCode(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function getOrCreateCartCode() {
  let code = localStorage.getItem("cart_code");
  if (!code) {
    code = generateCode();
    localStorage.setItem("cart_code", code);
  }
  return code;
}
