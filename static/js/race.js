activityModule.controller('race', function($scope, $http, $stateParams, $q) {
    $scope.stories = []
    $scope.id = $stateParams.id
    $q.all([
        $http.get('/api/v1/stories/'+$scope.id).
            then(function (response) {
                $scope.race = response.data.data
            }, function (response) {
                console.log(response)
            }),
    ]).then(function () {
    })
});