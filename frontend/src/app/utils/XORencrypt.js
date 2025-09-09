export function encodeNumberXOR(num, key = 123) {
    return num ^ key;
  }
  
 export function decodeNumberXOR(encoded, key = 123) {
    return encoded ^ key;
  }
  
  let encoded = encodeNumberXOR(456);  // Obfuscated number
  let decoded = decodeNumberXOR(encoded); // Back to 456

  