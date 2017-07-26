export function hasClass(el, className) {
  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`);
  return reg.test(el.className);
}

export function addClass(element, className) {
  const el = element;
  if (hasClass(el, className)) {
    return;
  }

  const newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}
