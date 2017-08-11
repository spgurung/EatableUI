angular.module('app.controllers', [])

	// Login Controller
  .controller('loginController', function($scope, $rootScope, $http) {
    $scope.credential={};
    $scope.login = function(){
      var baseUrl = $rootScope.backend_host + "AppBackend/rest/user/validate?";
      baseUrl = baseUrl+'userName=' + $scope.credential.username + '&';
      baseUrl = baseUrl +'password=' + $scope.credential.password;
      $http.get(baseUrl).then(function(response){
        $rootScope.loggedInUser = response.data.user;
          $scope.$state.go("home");
      },
      function(response){
        $scope.error = "Login Failed. " + response.data.reason;
      })
    }

	// Logout
    $scope.logout = function(){
      $rootScope.loggedInUser = null;
      $scope.$state.go("login");
    }
  })

	// Setting Controller lets users choose their allergies
  .controller('settingController', function($scope, $rootScope, $http, $state){
     if($rootScope.loggedInUser != null)
     {
       $scope.userdata ={}
       $scope.allergen = {
         peanut: false,
         egg: false,
         milk: false,
         soy: false,
         shellfish: false,
         almond: false
       }
        $scope.userdata= $rootScope.loggedInUser;
        for(var i=0; i< $scope.userdata.allergy.length; i++)
        {
          if($scope.userdata.allergy[i] == 'peanut')
            $scope.allergen.peanut = true;
          if($scope.userdata.allergy[i] == 'egg')
            $scope.allergen.egg = true;
          if($scope.userdata.allergy[i] == 'milk')
            $scope.allergen.milk = true;
          if($scope.userdata.allergy[i] == 'soy')
            $scope.allergen.soy = true;
          if($scope.userdata.allergy[i] == 'shellfish')
            $scope.allergen.shellfish = true;
          if($scope.userdata.allergy[i] == 'almond')
            $scope.allergen.almond = true;
        }
     }

	// Update Controller
     $scope.update = function(){
       var url = $rootScope.backend_host + "AppBackend/rest/user/updateUser";
       var selectedAllergen = [];
       if($scope.allergen.peanut)
         selectedAllergen.push("peanut");
       if($scope.allergen.egg)
         selectedAllergen.push("egg");
       if($scope.allergen.milk)
         selectedAllergen.push("milk");
       if($scope.allergen.soy)
         selectedAllergen.push("soy");
       if($scope.allergen.shellfish)
         selectedAllergen.push("shellfish");
       if($scope.allergen.almond)
         selectedAllergen.push("almond");
       if(selectedAllergen.length < 1)
       {
         $scope.error = 'Did you forget to select your allergens?';
         return;
       }

       var data = {
         id: $scope.userdata.id,
         userName: $scope.userdata.userName,
         firstName: $scope.userdata.firstName,
         lastName: $scope.userdata.lastName,
         allergy: selectedAllergen
       }

       $http.post(url, data).then(function (response) {
         $rootScope.loggedInUser = response.data.user;
         $scope.$state.go("home");
       }, function (error) {
         var err = "Update Failed. ";
         if(error.data != null)
           err = err + error.data.reason;
         $scope.error = err;
       });
     }
  })

	// Register Controller
  .controller('registerController', function($scope, $rootScope, $http){
    $scope.input ={} // Object to bind ng-model values to controller
    $scope.allergen ={
      peanut: false,
      egg: false,
      milk: false,
      soy: false,
      shellfish: false,
      almond: false
    }
    $scope.register = function(signupForm) {
      if (signupForm.$valid)
      {
        var url = $rootScope.backend_host + "AppBackend/rest/user/createUser";
        var selectedAllergen = [];
        if($scope.allergen.peanut)
          selectedAllergen.push("peanut");
        if($scope.allergen.egg)
          selectedAllergen.push("egg");
        if($scope.allergen.milk)
          selectedAllergen.push("milk");
        if($scope.allergen.soy)
          selectedAllergen.push("soy");
        if($scope.allergen.shellfish)
          selectedAllergen.push("shellfish");
        if($scope.allergen.almond)
          selectedAllergen.push("almond");
        if(selectedAllergen.length < 1)
        {
          $scope.error = 'Did you forget to select your allergens?';
          return;
        }

        var data = {
          userName: $scope.input.username,
          password: $scope.input.password,
          firstName: $scope.input.firstname,
          lastName: $scope.input.lastname,
          allergy :selectedAllergen
        }

        $http.post(url, data).then(function (response) {
          $rootScope.loggedInUser = response.data.user;
          $scope.$state.go("home");
        }, function (error) {
          $rootScope.loggedInUser = null;
          var err = "Registration Failed. ";
          if(error.data != null)
            err = err + error.data.reason;
          $scope.error = err;
        });
      }
      }
  })

	// Store Controller manages store data
  .controller('storeController', function($scope, $http, $rootScope, dataService){
    dataService.findProduct().success(function(data) {
      $scope.storeResult = data;
      dataService.setResult(data);
    });
  })

	// Location Controller manages locations of the stores
  .controller('locationController', function($scope, dataService, $stateParams){
    $scope.storeType = $stateParams.storeType;
    $scope.store = dataService.getStore($stateParams.storeType);
  })

	// Product Controller fetches products found in the given location and storeType
.controller('productController', function($scope, $stateParams, dataService) {
  $scope.locationId = $stateParams.location;
  $scope.storeType = $stateParams.storeType;
  $scope.product = dataService.getProduct( $stateParams.location, $stateParams.storeType);
})

// Displays google map of the store location
 .controller('mapController', function($scope, $stateParams){
    var coordinates = $stateParams.location.split(" ");
    var location = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
     var mapOptions ={
       center: location,
       zoom: 16,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(document.getElementById("map"), mapOptions);

     $scope.map = map;

   google.maps.event.addListenerOnce($scope.map, 'idle', function() {
     var coordinates = $stateParams.location.split(" ");
     var marker = new google.maps.Marker({
       map: $scope.map,
       animation: google.maps.Animation.DROP,
       position: new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]))
     });
   })

 })

// Location Controller - fetches user's current location
.controller('locateController', function($scope, $http, $rootScope, $cordovaGeolocation) {
  var searchText = '';
  $scope.info = null;

  $scope.geoLocation = function() {

    var result = $.Deferred();

    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
        result.resolve(lat + ', ' + long);
      }, function(err) {
        alert('Error occurred while fetching location: ' + err.message);
        result.resolve('');
      });
    return result;
  };

   $scope.locate = function (productName) {
   // var locationresult = $scope.geoLocation();
    //locationresult.done(function (location) {
      var url = $rootScope.backend_host + 'AppBackend/rest/product/locateProduct?productName=' + productName + '&userLocation=' + '42.426620, -71.137149';//ocation;
      $http.get(url).success(function (data) {
        $scope.productLocations = data;
        $scope.info = data.length + ' locations found for ' + productName;
      });
    //})
  }
})

 // Home Controller
 .controller('homeController', function($scope, $cordovaBarcodeScanner, $cordovaGeolocation, $http, $rootScope, $ionicPopup, $stateParams) {

   $scope.scanBarcode = function() {
    var result = $.Deferred();
    $cordovaBarcodeScanner.scan().then(function(imageData) {
     result.resolve(imageData.text);
     }, function(error) {
       console.log("Error occurred while scanning the barcode: " + error)
      result.resolve('');
     });
    return result;
   };

   $scope.geoLocation = function() {

     var result = $.Deferred();

     var posOptions = {timeout: 10000, enableHighAccuracy: true};
     $cordovaGeolocation
       .getCurrentPosition(posOptions)
       .then(function (position) {
         var lat  = position.coords.latitude
         var long = position.coords.longitude
         result.resolve(lat + ', ' + long);
       }, function(err) {
         alert('Error occurred while fetching location: ' + err.message);
         result.resolve('');
       });
     return result;
  };

  $scope.checkProduct = function(){
    if($rootScope.loggedInUser == null)
      return $scope.$state.go("login");

     var barcoderesult = $scope.scanBarcode();
     barcoderesult.done(function(barcode){
       var locationresult = $scope.geoLocation();

       locationresult.done(function(location){
         var allergy = $rootScope.loggedInUser.allergy;
         var baseUrl= $rootScope.backend_host + "AppBackend/rest/product/checkproduct?";
         baseUrl = baseUrl + "upc=" + barcode;
         baseUrl = baseUrl + "&location=" + location; //"42.407029, -71.132240"
         var allergyQuery='';
         for(var i = 0; i<allergy.length; i++)
         {
           allergyQuery = allergyQuery + '&allergyList=' + allergy[i];
         }
         baseUrl = baseUrl + allergyQuery;
         if(barcode && location)
         {
           $http.get(baseUrl)
             .then(function(response){
                 if (response.data.status == 'SAFE') {
                   $ionicPopup.alert({
                     title: '',
                     template: 'This product is safe for you. Enjoy.',
                     buttons: [
                       {
                         text: 'OK',
                         type: 'button-stable'
                       }
                     ]
                   });
                 }
                 else if (response.data.status == 'NOT_FOUND') {
                   $ionicPopup.alert({
                     title: '',
                     template: 'Sorry, this product cannot be verified. Not found in database.',
                     buttons: [
                       {
                         text: 'OK',
                         type: 'button-stable'
                       }
                     ]
                   });
                 }
                 else {
                   var unsafeList = '';
                   for (var i = 0; i < response.data.unsafeAllergenList.length; i++) {
                     unsafeList = unsafeList + response.data.unsafeAllergenList[i] + " ";
                   }
                   $ionicPopup.alert({
                     title: '',
                     template: 'This product is Unsafe for you because it contains following allergens:<br\>' + unsafeList,
                     buttons: [
                       {
                         text: 'OK',
                         type: 'button-stable'
                       }
                     ]
                   });
                 }
               },
               function(error) {
                 $ionicPopup.alert({
                   title: 'Error',
                   template: 'Unable to process request',
                   buttons: [
                     {text: 'OK',
                       type: 'button-stable'}
                   ]
                 });
               }
             );
         }
         else
         {
           $ionicPopup.alert({
             title: 'Error',
             template: 'Please retry. Unable to fetch barcode and location',
             buttons: [
               {text: 'OK',
                 type: 'button-stable'}
             ]
           });
         }
      });
   });
  };


   $scope.callApi = function(){

     if($rootScope.loggedInUser == null)
       return $scope.$state.go("login");
        var baseUrl = $rootScope.backend_host + "AppBackend/rest/product/checkproduct?upc=01485508&location=42.407029, -71.132240";
        var allergy = $rootScope.loggedInUser.user.allergy;
         var allergyQuery='';
         for(var i = 0; i<allergy.length; i++)
         {
           allergyQuery = allergyQuery + '&allergyList=' + allergy[i];
         }
          baseUrl = baseUrl + allergyQuery;
         $http.get(baseUrl)
           .then(function(response) {
               if (response.data.status == 'SAFE') {
                 $ionicPopup.alert({
                   title: '',
                   template: 'This product is safe for you. Enjoy.',
                   buttons: [
                     {
                       text: 'OK',
                       type: 'button-stable'
                     }
                   ]
                 });
               }
               else if (response.data.status == 'NOT_FOUND') {
                 $ionicPopup.alert({
                   title: '',
                   template: 'Sorry, this product cannot be verified. Not found in database.',
                   buttons: [
                     {
                       text: 'OK',
                       type: 'button-stable'
                     }
                   ]
                 });
               }
               else {
                 var unsafeList = '';
                 for (var i = 0; i < response.data.unsafeAllergenList.length; i++) {
                   unsafeList = unsafeList + response.data.unsafeAllergenList[i] + " ";
                 }
                 $ionicPopup.alert({
                   title: '',
                   template: 'This product is Unsafe for you because it contains following allergens:<br\>' + unsafeList,
                   buttons: [
                     {
                       text: 'OK',
                       type: 'button-stable'
                     }
                   ]
                 });
               }
             },
             function(error) {
               $ionicPopup.alert({
                 title: 'Error',
                 template: 'Unable to process request',
                 buttons: [
                   {text: 'OK',
                   type: 'button-stable'}
                 ]
               });
             }
           );
   };

   $scope.showSafeAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });

     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

   $scope.showUnsafeAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });

     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
  })






