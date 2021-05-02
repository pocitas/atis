// TODO: Kam se mi poděl kód, automaticky načítající čas vydání?

// ATIS application object
var a = {
  version: "0.0.1",
  messageString: "",
  takeoffCheckbox: true,
  glidersCheckbox: false,
  visibilityCheckbox: false,
  releaseTime: "",
  rwySelect: "24",
  patternSelect: "right-hand",
  rwyTakeoffSelect: "27L",
  rwyGlidersSelect: "27R",
  patternGlidersSelect: "left-hand",
  windDirection: "",
  windSpeed: "",
  visibility: "",
  messageSuffix: ""
  /*,
  generateMessage: function(){
    // default values
    let timeText = this.releaseTime || "0000";
    let visibilityText = this.visibility || "9999";
    this.messageString  = "Bene Radio traffic information " + timeText + ".\n";
    this.messageString += "Runway in use " + this.rwySelect + ", " + this.patternSelect + " pattern.\n";
    if(this.takeoffCheckbox) this.messageString += "For the first takeoff runway " + this.rwyTakeoffSelect + ".\n"
    if(this.glidersCheckbox) this.messageString += "For the gliders runway " + this.rwyGlidersSelect + ", " + this.patternGlidersSelect + " pattern.\n";
    this.messageString += "Wind " + this.windDirection + " degrees " + this.windSpeed + " knots.\n";
    // TODO: rozliš dohlednost na metry nebo kilometry.
    if(this.visibilityCheckbox) this.messageString += "Visibility " + visibilityText + " meters.\n";
    this.messageString += this.messageSuffix;
  }*/
}

// Vue object
var v = new Vue({
  el: '#mainContainer',
  data: {
    a
  },
  computed: {
    messageString: function(){
      // default values
      let releaseTime = a.releaseTime || "0000";
      let windDirection = a.windDirection || "000";
      let windSpeed = a.windSpeed || "00";
      let visibility = a.visibility || "9999";
      let messageString;
      messageString  = "Bene Radio traffic information " + releaseTime + ".\n";
      messageString += "Runway in use " + a.rwySelect + ", " + a.patternSelect + " pattern.\n";
      if(a.takeoffCheckbox) messageString += "For the first takeoff runway " + a.rwyTakeoffSelect + ".\n"
      if(a.glidersCheckbox) messageString += "For the gliders runway " + a.rwyGlidersSelect + ", " + a.patternGlidersSelect + " pattern.\n";
      messageString += "Wind " + windDirection + " degrees " + windSpeed + " knots.\n";
      // TODO: rozliš dohlednost na metry nebo kilometry.
      if(a.visibilityCheckbox) messageString += "Visibility " + visibility + " meters.\n";
      messageString += a.messageSuffix;
      return messageString;
    }
  }
});
