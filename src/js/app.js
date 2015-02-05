angular.module('flannel', [
  'ngCookies',
  'flannel.config',
  'ui.router',
  'firebase',
  'rx',
  'ngTouch',
  'stages',
  'flannel.providers',
  'flannel.firebase',
  'flannel.controllers',
  'flannel.directives',
  'nouislider'
]).config(function($sceDelegateProvider, $sceProvider, $httpProvider, UserProvider, SessionProvider) {
  // hack: sorta hacky... but maybe not.
  // http://stackoverflow.com/questions/20588114/how-to-use-cookiesprovider-in-angular-config
  var $cookies, uid;
  angular.injector(['ngCookies']).invoke(function(_$cookies_) {
    $cookies = _$cookies_;
  });

  // $cookies.uuid is set by the server after getting an auth token from Firebase
  uid = $cookies.uuid;
  uid && (uid = uid.split(":")[1].split(".")[0]); // hack: is this too ugly to live?

  if ($cookies.user_id) {
    // returning visitor
    console.log('**** VISITOR HAS 1 WHOLE COOKIE ****', $cookies.user_id);
    // make the User provider use the correct user
    UserProvider.setRefKey($cookies.user_id);
  } else {
    // new visitor
    console.log('**** VISITOR HAS NO COOKIE ****', uid);
    UserProvider.setRefKey(uid);
  }

  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain. Notice the difference between * and **.
   'http://localhost:8100/**',
   'http://scexchange.solarcity.com/scfilefactory/testfill.aspx'
  ]);
  $sceProvider.enabled(false);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(["$rootScope", "$cookies", "$cookieStore", "User", "Session", "Clientstream", function run_app($rootScope, $cookies, $cookieStore, User, Session, Client) {
  // let the app know we've gotten the important stuff :)
  User.ref().once('value', function setSessionFromUser (ds) {
    // let session know we've loaded the User. now load the session.
    Client.emit('App.run: User Loaded', ds);
  });
}]);

var providers   = angular.module('flannel.providers',[]);
var controllers = angular.module('flannel.controllers',[]);
var directives  = angular.module('flannel.directives',[]);
var options     = angular.module('flannel.options',[]);
