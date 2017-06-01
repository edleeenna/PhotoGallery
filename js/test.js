/*global angular */
(function() {
    "use strict";
    var app = angular.module("myApp", ["ngRoute"]);

    app.config(function($routeProvider, $locationProvider) {
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


    app.controller("myCtrl", function($scope, $location) {
        $scope.menuClass = function(page) {
            var current = $location.path().substring(1);
            return page === current ? "active" : "";
        };
    });

    app.controller("getCtrl",
        function($scope, $http, $location) {
            $http.get('http://localhost:3000/posts')
                .then(
                    function(response) {
                        $scope.obj = response.data;
                    },
                    function(response) {
                        $scope.error = "Something is wrong with the file";
                    }
                );

           $scope.objOrder = 'earliest'; //initialise 'objOrder' to earliest so that the Earliest labeled radio button is automatically checked

        });


    app.controller("editCtrl",
        function($scope, $http, $location, $routeParams, $route) {
            $scope.imageId = $routeParams.id;

            $http.get('apis/selectonephoto.php?id=' + $scope.imageId)
                .then(
                    function(response) {
                        $scope.newObj = response.data;


                    },
                    function(response) {
                        $scope.error = "Something is wrong with the file";
                    }
                );

            // declare methods
            $scope.putData =   function(id, title, description, date, keywords) {
                // Prepare the data
                var url = "apis/updateimage.php",
                    data = JSON.stringify({
                        id: id,
                        title: title,
                        description: description,
                        date: date,
                        keywords: keywords

                    });


                //Call the services
                $http.put(url, data)
                    .then(function (response) {
                        // depends on the data value
                        // there may be instances of put failure
                        if  (response.data) {
                            $scope.msg =  "Data successfully updated.";
                        }
                    },  function (response) {
                        $scope.msg =  "Service not exists";
                        $scope.statusval = response.status;
                        $scope.statustext = response.statusText;
                        $scope.headers = response.headers();
                    });
            };

            //After user edits an image, redirect to home
            $scope.redirect = function($route) {
                $location.url('..');
              $route.reload();
            };
        });

    //Post controller that allows the user to upload an image from a form to the database. Upload.html
    app.controller("uploadCtrl",
        function($scope, $http) {
            // property initialisation
            $scope.title = null;
            $scope.description = null;
            $scope.date = null;
            $scope.url = null;
            $scope.keywords = null;
            // define methods
            $scope.postData = function(title, description, date, url, keywords) {
                // Prepare the data
                var jsonTable = "./apis/insertintophotogallery.php";
                var data = JSON.stringify({
                    title: title,
                    description: description,
                    date: date,
                    url: url,
                    keywords: keywords
                });

                $http.post(jsonTable, data)
                    .then(function(response) {
                        // depends on the data value
                        // there may be instances of put failure
                        if (response.data)
                            $scope.msg = "Data successfully inserted.";

                    }, function(response) {
                        $scope.msg = "Service not exists";
                        $scope.statusval = response.status;
                        $scope.statustext = response.statusText;
                        $scope.headers = response.headers();
                    });
            };


            //Reset form after form is submitted
            var defaultForm = {
                title: "",
                description: "",
                date: "",
                url: "",
                keywords: ""
            }

            $scope.photo = angular.copy(defaultForm);
            $scope.reset = function() {
                $scope.myForm.$setPristine();
                $scope.photo = angular.copy(defaultForm);

            }

        });

}());
