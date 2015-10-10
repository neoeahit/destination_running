activityModule.controller('DemoCtrl', function ($scope, $http, $location, $q) {
    $scope.increaseVote = function (id) {
        $scope.reviews
        $.grep($scope.reviews, function (e) {
            if(e.id == id){
                e.upvote++;
            }
        });
        $http.get('/api/update/upvotes/' + id).
            then(function (response) {
                console.log('awesum')
            }, function (response) {
                console.log(response)
            })
    }


    $q.all([
        $http.get('/api/race/BrooklynHalf').
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