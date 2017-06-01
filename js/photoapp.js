/*global angular */
(function () {
  "use strict";
  var app = angular.module("myApp", ["ngRoute", "ngResource"]);

  app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.
      when("/upload", {
        templateUrl: "templates/uploadimage.html",
        controller: "uploadCtrl"
      }).
      when("/edit/:id", {
        templateUrl: "templates/editimage.html",
        controller: "editCtrl"
      }).
      when("/home", {
        templateUrl: "templates/showall.html",
        controller: "getCtrl"
      }).
      otherwise({
        redirectTo: "/home"
      });
  });

    //Gallery factory
  app.factory("Gallery", function ($resource) {
    return $resource('http://localhost:3000/posts/:id', {
      id: '@id'
    }, {
      update: {
        method: "PUT"
      }
    });

  });

  app.controller("myCtrl", function ($scope, $location) {
    $scope.menuClass = function (page) {
      var current = $location.path().substring(1);
      return page === current ? "active" : "";
    };
  });

    //get controller, purpose is to retrieve object from server
  app.controller("getCtrl", function ($scope, $window, $location, Gallery) {
    $scope.obj = Gallery.query();
    $scope.objOrder = 'earliest'; //initialise 'objOrder' to earliest so that the Earliest labeled radio button is automatically checked

    //delete data by id
    $scope.delData =  function (id) {
      Gallery.remove({
        id: id
      });
    };

    //refresh page after deletion
    $scope.refresh = function ($route) {
      $window.location.reload();
    };
  });

  //controller for editimage.html. purpose is to allow user to edit image details based on id
  app.controller("editCtrl", function ($scope, $window, $location, $routeParams, Gallery) {
    $scope.imageId = $routeParams.id;

    $scope.newObj = Gallery.get({
      id: $routeParams.id
    });

    $scope.putData = function (id, title, description, date, url, keywords) {
      var data = {
        "id": id,
        "title": title,
        "description": description,
        "date": date,
        "url": url,
        "keywords": keywords
      };

      Gallery.update({id: id}, data);

    };

    //After user edits an image, redirect to home
    $scope.redirect = function () {
      $location.url('..');
      $window.location.reload();
    };
  });

    //Post controller that allows the user to upload an image from a form to the database. Upload.html
  app.controller("uploadCtrl", function ($scope, Gallery) {
            //post new data into array
    $scope.postData = function (title, description, date, url, keywords) {
      // Prepare the data
      var data = {
        "title": title,
        "description": description,
        "date": date,
        "url": url,
        "keywords": keywords
      };
      Gallery.save({}, data);
    };

    //Reset form after form is submitted
    var defaultForm = {
      title: "",
      description: "",
      date: "",
      url: "",
      keywords: ""
    };
    //reset form
    $scope.photo = angular.copy(defaultForm);
    $scope.reset = function () {
      $scope.myForm.$setPristine();
      $scope.photo = angular.copy(defaultForm);

    };

  });

}());
