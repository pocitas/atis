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
  messageSuffix: ""
};

// Vue object
var v = new Vue({
  el: '#mainContainer',
  data: {
    a
  },
  computed: {
    releaseTimePlaceholder: function(){ return releaseTimeAuto() },
    messageString: function(){
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
      messageString += "Wind " + windDirection + " degrees " + windSpeed
      if(a.windGustCheckbox) messageString += " knots, gusting " + a.windGust;
      messageString += " knots.\n";
      // TODO: rozliš dohlednost na metry nebo kilometry.
      if(a.visibilityCheckbox) messageString += "Visibility " + visibility + " meters.\n";
      messageString += a.messageSuffix ? (a.messageSuffix + "\n"):"";
      messageString += "\nContact Bene radio 118,005."
      // save "a" object to a localStorage
      localStorage.setItem("a",JSON.stringify(a));
      return messageString;
    }
  },
  mounted() {
    // SSML testing button
    document.querySelector("button#ssml").addEventListener("click", function() { console.log(toSSML())});
  }
});

// Convert message string into speechable SSML
function toSSML(messageString) {
  // replace numbers
  let stage1 = v.messageString.replace(/[0-9]/g, function ($m) {
    let search = ["0","1","2","3","4","5","6","7","8","9",","];
    let replacement = ["zero ","one ","two ","three ","four ", "fiver ", "six ", "seven ", "eight ", "niner ", "decimal "];
    let key = search.indexOf($m);
    return (key !== -1) ? replacement[key] : $m;
  });
  return stage1;
}
