window.onload = function () {
   
   var page = new settingsPage(false);
   page.initialise();
   
};

//manages the settings page
var settingsPage = (function () {
   
  //constructor
  function settingsPage (shouldClear) {
      
      //testing only
      if (shouldClear) {
         evadi.blabr.data.clearSettings();
      }
      
      //user setting for display target
      this.display = ko.observable("CONSOLE");
      this.shortcuts = ko.observableArray();
      
      //handles the read and write of display binding
      this.display.forEdit = ko.computed({
         read: function () {
            return this.display();
         },
         write: function (newValue) {
            this.display(newValue);
         },
         owner: this
      });
      ko.applyBindings(this);
      
   }
   
   //initialise the settings page
   settingsPage.prototype.initialise = function () {
      //read user settings and apply them
      var _this = this;
      evadi.blabr.data.getSettings(function (settings) {
         _this.applySettings(settings);
      });
      
      //show the keyboard shortcuts associated with this application
      evadi.blabr.shortcuts.getAll(function (commands) {
         if (commands && commands.length > 1) {
            commands.shift();
            console.log(commands);
            _this.shortcuts(commands);
         }
      });
   };
   
   //takes the raw settings object retrieved from data provider and applies the values
   settingsPage.prototype.applySettings = function (settings) {
      //read the values from the settings object and assign it to this class
      if (settings) {
         this.display(settings["display"]);
      }
      else {
         console.log("no settings file found");
      }
   };
   
   //handles the UI element for saving settings - passes on the data provider
   settingsPage.prototype.saveSettings = function () {
      //read state of the page and save the settings
      evadi.blabr.data.saveSettings(ko.toJSON(this), function() {
         console.log("settings saved");
      });
   };
   
   return settingsPage;
   
})();
