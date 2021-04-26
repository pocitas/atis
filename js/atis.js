// disable optional message blocks
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

// ATIS application object
var a = {
  version: "0.0.1"
}

// Vue object
var v = new Vue({
  el: '#mainContainer',
  data: {
    a
  }
})
