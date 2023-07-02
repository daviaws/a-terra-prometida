/**
 * Create a HTML element with attributes and children
 *
 * @param {string} type
 * @param {{children?: (HTMLElement | undefined | null)[], className?: string} & Object<string, any> } props
 * @returns {HTMLElement}
 */
export function createHtmlElement(type, props) {
  const element = document.createElement(type)
  for (const [key, value] of Object.entries(props)) {
    if (key === "className") {
      element.className = value
      continue
    }
    element.setAttribute(key, value)
  }

  if (!props.children?.length) {
    return element
  }

  for (const child of props.children) {
    if (!child) {
      continue
    }
    element.appendChild(child)
  }

  return element
}
