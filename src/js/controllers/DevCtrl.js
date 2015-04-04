/* ==================================================
  DevCtrl
  the dev tools controller
================================================== */

controllers.controller("DevCtrl", ["$scope", "Clientstream", "Form", DevCtrl_]);

function DevCtrl_($scope, Client, Form) {
  var vm = this;
  vm.prospect = Form.prospect;
  Client.listen('Form: Loaded', subscribeForm);

  vm.resetForm = function resetForm () {
    Client.emit('Dev: Reset form');
  }

  vm.reloadApp = function reloadApp () {
    Client.emit('Dev: Reset form');
    location.hash = 'my-home';
    location.reload(true);
  }

  function subscribeForm (form_obj) {
    // subscribing to form
    // vm.prospect = form_obj;
    Form.form_stream()
    .select(function(x) { return x.exportVal(); })
    .subscribe(streamSubscription);
  }

  function streamSubscription (form_obj) {
    // subscription made
    var key, keys, val;
    if (form_obj === null) return; // will be null if no data on firebase
    keys = Object.keys(form_obj);  // HACK: this may fail in different js interpreters... #readabookbrah
    if (!angular.equals(form_obj, vm.prospect())) { // firebase different from local
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        val = form_obj[key];
      }
      setTimeout(function() {
        if (!$scope.$$phase) $scope.$apply(); // update the views
        console.log('prospect is:', vm.prospect());
      }, 0);
    }
  }
}
