activityModule.controller('DemoCtrl', function($scope, $http, $location, $q) {
    $scope.stories = []
    $q.all([
        $http.get('/api/race/NYRRMidnightRun').
            then(function (response) {
                $scope.photos = response.data.data.photos
                $scope.raceinfo = response.data.data.race_info
                $scope.reviews = response.data.data.reviews
            }, function (response) {
                console.log(response)
            }),
    ]).then(function () {
    })
});