function toggleDisabled(elementId, checkboxElement) {
  let el = document.getElementById(elementId);
  let formElements = el.querySelectorAll("input, select");
  elements = [...formElements, el]
  if(checkboxElement.checked) {
    elements.forEach(function(element) {
      element.removeAttribute("disabled");
      element.classList.remove("disabled");
    });
  }
  else {
    elements.forEach(function(element) {
      element.setAttribute("disabled","disabled");
      element.classList.add("disabled");
    });
  }
}
