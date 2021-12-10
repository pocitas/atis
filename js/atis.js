// Current UTC time, rounded to 15 minutes
function releaseTimeAuto() {
  let cas = new Date();
  let hrs = cas.getUTCHours();
  let mts = Math.round(cas.getMinutes() / 15) * 15;
  if(mts == 60) {
    hrs++;
    mts = 0;
  }
  return "".concat(hrs.toString().padStart(2, "0"),mts.toString().padStart(2, "0"));
}

// ATIS application data object
var a = JSON.parse(localStorage.getItem("a")) || {
  version: "0.0.1",
  takeoffCheckbox: true,
  glidersCheckbox: false,
  windGustCheckbox: false,
  visibilityCheckbox: false,
  releaseTime: "",
  rwySelect: "24",
  patternSelect: "right-hand",
  rwyTakeoffSelect: "27L",
  rwyGlidersSelect: "27R",
  patternGlidersSelect: "left-hand",
  windDirection: "",
  windSpeed: "",
  windGust: "",
  visibility: "",
  messageSuffix: "",
  customMessageString: ""
};

function saveState() {
  localStorage.setItem("a",JSON.stringify(a));
}

// Vue object
var v = new Vue({
  el: '#mainContainer',
  data: {
    a
  },
  computed: {
    releaseTimePlaceholder: function(){ return releaseTimeAuto() },
    connectedIndicator: function(){ return a.customMessageString ? "X" : "&#8681; &#8681; &#8681;" },
    messageString: {
      get: function(){
        // Display a customized message (from <textarea>) or a generated.
        if(a.customMessageString){
          return a.customMessageString;
        }
        else {
          // Compose the message
          let releaseTime = a.releaseTime || releaseTimeAuto();
          let windDirection = a.windDirection || "000";
          let windSpeed = a.windSpeed || "00";
          let windGust = a.windGust || "00";
          let visibility = a.visibility;
          let messageString;
          messageString  = "Bene Radio traffic information " + releaseTime + ".\n";
          messageString += "Runway in use " + a.rwySelect + ", " + a.patternSelect + " pattern.\n";
          if(a.takeoffCheckbox) messageString += "For the first takeoff runway " + a.rwyTakeoffSelect + ".\n"
          if(a.glidersCheckbox) messageString += "For the gliders runway " + a.rwyGlidersSelect + ", " + a.patternGlidersSelect + " pattern.\n";
          messageString += "Wind " + windDirection + " degrees, " + windSpeed
          if(a.windGustCheckbox) messageString += " knots, gusting " + a.windGust;
          messageString += " knots.\n";
          if(a.visibilityCheckbox) {
            messageString += "Visibility ";
            if(visibility % 1000 == 0 && visibility / 1000 > 0) {
              let s = visibility / 1000 > 1 ? "s":"";
              messageString += visibility / 1000 + " kilometer" + s + ".\n";
            }
            else {
              messageString += visibility + " meters.\n";
            }
          }
          messageString += a.messageSuffix ? (a.messageSuffix + "\n"):"";
          messageString += "\nContact Bene radio 118,005."
          // save "a" object to a localStorage
          saveState();
          return messageString;
        }
      },
      set: function(textareaValue){
          a.customMessageString = textareaValue;
          // save "a" object to a localStorage
          saveState();
      }
    }
  },
  mounted() {
    // SSML testing button
    document.querySelector("button#ssml").addEventListener("click", function() { requestMP3() });
    document.querySelector("a#connectedIndicator").addEventListener("click", function() { a.customMessageString = "" });
  }
});

// Convert the message string into a speechable SSML
function toSSML() {
  let stage = [v.messageString];

  // transform visibility number
  stage.push(stage[stage.length-1].replace(/(?<=visibility\s*)\d+\s(?=meters)/gi, function(match) {
    let digits = match.split('').reverse().slice(3);
    let ret = match;
    if(!(match % 100)) {
      let thousands = digits[1] > 0 ? digits[1] + " thousand " : "";
      let hundreds  = digits[0] > 0 ? digits[0] + " hundred " : "";
      ret = thousands + hundreds;
    }
    return ret;
  }));

  // replace runway L/R designators
  stage.push(stage[stage.length-1].replace(/(?<=\d{2})L/g, " left"));
  stage.push(stage[stage.length-1].replace(/(?<=\d{2})R/g, " right"));

  // replace a decimal (between two numbers) with a word
  stage.push(stage[stage.length-1].replace(/(?<=\d),(?=\d)/g, " decimal "));

  // add speech breaks
  // after the release time
  stage.push(stage[stage.length-1].replace(/(?<=traffic\sinformation \d{4}\.)/i, '<break strength="strong" />'));
  // before "Contact ..."
  stage.push(stage[stage.length-1].replace(/(?=contact\s)/i, '<break strength="strong" />'));
  // before "Local/Regional QNH"
  stage.push(stage[stage.length-1].replace(/(?=\b\w+\sqnh)/ig, "<break />"));
  // before numbers
  stage.push(stage[stage.length-1].replace(/\s(?=\d+)/g, "<break />"));

  // first remove all spaces before numbers, because these are included in a replacement
  stage.push(stage[stage.length-1].replace(/\s(?=\d)/g, ""));
  // then replace numbers
  stage.push(stage[stage.length-1].replace(/\d/g, function(match) {
    let search = ["0","1","2","3","4","5","6","7","8","9"];
    let replacement = ["zero","one","two","three","four", "five", "six", "seven", "eight", "niner"];
    let key = search.indexOf(match);
    return (key !== -1) ? " " + replacement[key] : match;
  }));

  return "<speak>" + stage[stage.length-1] + "</speak>";
}

function requestMP3() {

  axios.post('https://271.cz', {
    superTajneHeslo: '',
    message: toSSML()
  })
  .then((response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  });

}
