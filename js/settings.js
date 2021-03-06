var controller;

window.onload = function () {

   var page = new settingsPage(false);
   page.initialise();

   //cache the controller from the background page
   controller = chrome.extension.getBackgroundPage().controller;
};

//Allows different display targets to be used via constants
var displayTypes = Object.freeze({
   CONSOLE: "CONSOLE",
   PAGE: "PAGE"
});

//manages the settings page
var settingsPage = (function () {

  //constructor
  function settingsPage (shouldClear) {

      //testing only
      if (shouldClear) {
         evadi.blabr.data.clearSettings();
      }

      //user setting for display target
      this.display = ko.observable(displayTypes.PAGE);

      //keyboard shortcuts for this application
      this.shortcuts = ko.observableArray();

      //flag used to show a saved message to the user
      this.settingsSaved = ko.observable(false);

      //selects console as an output method
      this.selectConsole = function () {
         this.display(displayTypes.CONSOLE);
      };

      //selects page as an output method
      this.selectPage = function () {
         this.display(displayTypes.PAGE);
      };

      //initialise the knockoutjs bindings
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
            _this.shortcuts(commands);
         }
      });
   };

   //takes the raw settings object retrieved from data provider and applies the values
   settingsPage.prototype.applySettings = function (settings) {
      //set properties of this class based on the settings supplied
      if (settings) {
         this.display(settings.display);
      }
   };

   //handles the UI element for saving settings - passes on the data provider
   settingsPage.prototype.saveSettings = function () {
      //read state of the page and save the settings
      var _this = this;

      //seralise this class to be saved
      var settings = ko.toJSON(this);

      //save the settings object
      evadi.blabr.data.saveSettings(settings, function() {
         _this.settingsSaved(true);

         //inform the controller of the new settings
         controller.updateSettings(ko.mapping.toJS(_this));

         //display a message to the user indicating settings have been saved
         window.setTimeout(function () {
            _this.settingsSaved(false);
         }, 2000);

      });
   };

   return settingsPage;

})();
