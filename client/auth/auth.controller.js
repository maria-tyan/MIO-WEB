angular.module('mioweb', [])
  .controller('register', function() {
    scope.register = function(email, password) {
                            SessionService.register(email, password);
                        }
  });

