export function hashCode(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function isValidInput(str) {
  if (str.indexOf(".") != -1) {
    return false;
  }
  if (str.indexOf("#") != -1) {
    return false;
  }
  if (str.indexOf("$") != -1) {
    return false;
  }
  if (str.indexOf("[") != -1) {
    return false;
  }
  if (str.indexOf("]") != -1) {
    return false;
  }
  return true;
}
