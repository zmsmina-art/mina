export function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') element.className = val;
    else if (key === 'textContent') element.textContent = val;
    else if (key === 'innerHTML') element.innerHTML = val;
    else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), val);
    else element.setAttribute(key, val);
  }
  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  }
  return element;
}

export function svgEl(tag, attrs = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, val] of Object.entries(attrs)) {
    element.setAttribute(key, val);
  }
  return element;
}
