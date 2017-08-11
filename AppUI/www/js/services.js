angular.module('app.services', [])

// Fetches data shared between different pages

.service('dataService', function($rootScope, $http){

  var storeResult;

  this.findProduct= function() {

   var url = $rootScope.backend_host + "AppBackend/rest/product/findProducts?";
    var allergens = $rootScope.loggedInUser.allergy;
    var allergyQuery = '';
    for (var i = 0; i < allergens.length; i++) {
      if (i != 0)
        allergyQuery = allergyQuery + '&';
      allergyQuery = allergyQuery + 'allergyList=' + allergens[i];
    }
    url = url + allergyQuery;

    return $http.get(url);
  }

  this.setResult = function(result){
    this.storeResult = result;
  }

  this.getResult = function(){
    return this.storeResult;
  }
  this.getStore = function(storeType){

    for(var i=0; i< this.storeResult.length; i++)
    {
      if(this.storeResult[i].storeName == storeType)
      {
        return this.storeResult[i];
      }
    }
  }

  this.getProduct = function(locationId, storeType)
  {
    for(var i=0; i< this.storeResult.length; i++)
    {
      if(this.storeResult[i].storeName == storeType)
      {
        var storeLocations = this.storeResult[i].storeLocation;
        for(var j=0; j < storeLocations.length; j++)
        {
          if(storeLocations[j].id == locationId)
            return storeLocations[j].productResult;
        }
      }
    }
  }
});

