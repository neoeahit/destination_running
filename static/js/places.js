activityModule.controller('placesCtrl', function($scope, $http, messages) {

    $scope.instagramResults = messages.instagramResults

    $scope.yelpResults = messages.yelpResults;

    $scope.showSummary = function(){
        console.log($scope.places)
    }
});


