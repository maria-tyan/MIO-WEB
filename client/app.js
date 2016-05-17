(function () {
    'use strict';
    angular
        .module('mioweb', ['ui.router'])
        .config(config)
        .run(run)
        .service('SessionService', ['$rootScope', '$http',
            function($rootScope, $http) {
                var self = this;
                $rootScope.user = null;

                this.checkAccess = function() {
                    $http
                        .get('/api/auth/checkAccess')
                        .success(function(response) {
                            console.log('Logged in!')
                            $rootScope.user = response;
                        })
                        .error(function(err, status) {
                            $rootScope.user = null;
                        })
                }

                this.logout = function() {
                    $http
                        .get('/api/auth/logout')
                        .success(function(response) {
                            console.log('Logged out!')
                            $rootScope.user = null;
                        })
                        .error(function(err, status) {
                            $rootScope.user = null;
                        })
                }

                this.register = function(email, password) {
                    $http.post('/api/auth/register', {
                        email: email,
                        password: password,
                    });
                }

                this.login = function(email, password) {     
                    $http.post('/api/auth/login', {
                        email: email,
                        password: password,
                    })
                    .success(function(response) {
                        console.log('Logged in!')
                        $rootScope.user = response;
                    })
                    .error(function(err, status) {
                        $rootScope.user = null;
                    })
                }
                this.personalArea = function(){
                    $scope.$state.go('personalArea');
                }

                this.checkAccess();
            }
          ])
        .directive("loginForm", ['$rootScope', 'SessionService',
            function($rootScope, SessionService) {
              return {
                restrict: 'E',
                scope: {},
                templateUrl: './login/loginModalTemplate.html',
                replace: 'true',
                link: function(scope) {
                    $rootScope.$watch('user', function(value) {
                        scope.loggedIn = value;
                    });

                    scope.login = function(email, password) {
                        SessionService.login(email, password);
                    }

                    scope.logout = function() {
                        SessionService.logout();
                    }
                    scope.personalArea = function() {
                        SessionService.personalArea();
                    }
                    scope.register = function(email, password) {
                            SessionService.register(email, password);
                        }
                  }
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
            .state('personalArea', {
                url: "/personalArea",
                templateUrl: "personalArea/index.html"
            })
    }

    function run($http, $rootScope, $window) {
    }
})();

