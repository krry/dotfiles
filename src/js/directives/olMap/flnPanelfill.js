/* ==================================================

  flnPanelfill

  a directive used to create a Google Map with panels on it.

================================================== */

directives.directive('flnPanelfill', [flnPanelfill_]);

function flnPanelfill_ () {
  return {
    restrict: "A",
    controller: function ($scope, $element, $attrs, $stateParams, Proposal) {
      Proposal.setTarget($stateParams.design_key);
    },
    templateUrl: 'templates/directives/olmap/flnPanelfill.html',
  };
}
