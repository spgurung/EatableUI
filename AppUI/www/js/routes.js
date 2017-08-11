angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('allergies', {
    url: '/allergies',
    templateUrl: 'templates/allergies.html',
    controller: 'allergiesController'
  })

  .state('store', {
    url: '/store',
    templateUrl: 'templates/store.html',
    controller: 'storeController'
  })

  .state('result', {
    url: '/result/',
    templateUrl: 'templates/result.html',
    controller: 'resultController'
  })

  .state('product', {
    url: '/product/:location/:storeType',
    templateUrl: 'templates/product.html',
    controller: 'productController'
  })

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeController',
   onEnter: function($state, $rootScope){
      if($rootScope.loggedInUser == null){
        $state.go('login');
      }
    }
  })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController'
    })

   .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerController'
    })

    .state('allergy', {
      url: '/allergy',
      templateUrl: 'templates/allergy.html',
      controller: 'registerController'
    })

    .state('setting', {
      url: '/setting',
      templateUrl: 'templates/setting.html',
      controller: 'settingController'
    })

      .state('location', {
        url:'/location/:storeType',
        templateUrl: 'templates/location.html',
        controller: 'locationController'
      })

    .state('locate', {
      url:'/locate/',
      templateUrl: 'templates/locate.html',
      controller: 'locateController'
    })

    .state('map', {
      url:'/map/:location',
      templateUrl: 'templates/map.html',
      controller: 'mapController'
    })

    $urlRouterProvider.otherwise('/home')

});
