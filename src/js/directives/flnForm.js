angular.module('flnForm', flnForm);

function flnForm () {
  return {
    restrict: "A",
    controller: 'FormCtrl',
    controllerAs: 'form',
  };
}
