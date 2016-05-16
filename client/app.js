(function () {
    'use strict';
    angular
        .module('mioweb', ['ui.router'])
        .config(config)
        .run(run)
        .service('SessionService', [
            '$injector',
            function($injector) {
              "use strict";
              this.login = function(email, password) {
                      
                  $http.post('/login', {
                      email: email,
                      password: password,
                    })
                    .success(function(response) {
                      
                    })
                    .error(function(err, status) {
                      
                    })
                }
              this.checkAccess = function(event, toState, toParams, fromState, fromParams) {
                var $scope = $injector.get('$rootScope'),
                    $sessionStorage = $injector.get('$sessionStorage');

                if (toState.data !== undefined) {
                  if (toState.data.noLogin !== undefined && toState.data.noLogin) {
                    // если нужно, выполняйте здесь какие-то действия 
                    // перед входом без авторизации
                  }
                } else {
                  // вход с авторизацией
                  if ($sessionStorage.user) {
                    $scope.$root.user = $sessionStorage.user;
                  } else {
                    // если пользователь не авторизован - отправляем на страницу авторизации
                    event.preventDefault();
                    $scope.$state.go('auth.login');
                  }
                }
              };
            }
          ])
        .directive("loginForm", [
            function() {
              return {
                restrict: 'E',
                scope: {},
                templateUrl: './login/loginModalTemplate.html',
                replace: 'true',
                link: ['$scope', '$http', '$window',
                  function($scope, $http, $window, SessionService) {
                    $scope.loggedIn = SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
                    $scope.loginError = false;
                    $scope.login = function(email, password) {
                      SessionService.login(email, password);
                    }
                  }
                ]
              }
            }
        ]);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './home/index.html',
            })
    	    .state('statistic', {
    	        url: "/statistic",
    	        templateUrl: "statistic/index.html"
    	    })
    	    .state('download', {
    	        url: "/download",
    	        templateUrl: "download/index.html"
    	    })
    	    .state('contacts', {
    	        url: "/contacts",
    	        templateUrl: "contacts/index.html"
    	    })
    	    .state('buy', {
    	        url: "/buy",
    	        templateUrl: "buy/index.html"
    	    })
    }

    function run($http, $rootScope, $window) {
    }
})();

