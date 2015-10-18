activityModule.controller('DemoCtrl', function ($scope, $http, $location, $q, $modal) {


    $scope.increaseVote = function (id) {
        $scope.reviews
        $.grep($scope.reviews, function (e) {
            if (e.id == id) {
                e.upvote++;
            }
        });
        $http.post('/api/update/upvotes', {"id": id}).
            then(function (response) {
                console.log('awesum')
            }, function (response) {
                console.log(response)
            })
    }

    $scope.open = function () {

        $modal.open({
            templateUrl: 'addReview.html',
            backdrop: true,
            windowClass: 'modal',
            controller: function ($scope, $modalInstance, user) {

                /*
                 *  Ratings
                 *
                 * */

                $scope.ratings = [{
                    title: "Cost",
                    current: 5,
                    percent: 50
                }, {
                    title: "Course",
                    current: 5,
                    percent: 50
                },
                    {
                        title: "Fluid",
                        current: 5,
                        percent: 50
                    },
                    {
                        title: "Fuel",
                        current: 5,
                        percent: 50
                    },
                    {
                        title: "Crowd",
                        current: 5,
                        percent: 50
                    }
                ];

                $scope.hoveringOver = function (index, value) {
                    console.log($scope.ratings[index])
                    console.log($scope.ratings[index].percent)
                    $scope.ratings[index].percent = 100 * (value / 10);
                };

                /*
                 *
                 *  Rating ends
                 * */

                $scope.user = user;
                $scope.submit = function () {
                    // make a post call to db here!!!
                    $http.post('/api/add/review',
                        {
                            race: 'BrooklynHalf',
                            rating: {
                                Cost: $scope.ratings[0].current,
                                Course: $scope.ratings[1].current,
                                Fluid: $scope.ratings[2].current,
                                Fuel: $scope.ratings[3].current,
                                Crowd: $scope.ratings[4].current
                            },
                            pros: $scope.user.pros,
                            cons: $scope.user.cons,
                            story: $scope.user.story
                        }).
                        then(function (response) {

                        }, function (response) {
                        })
                    $modalInstance.dismiss('cancel'); // dismiss(reason) - a method that can be used to dismiss a modal, passing a reason
                }
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
    };


    $q.all([
        $http.post('/api/race', {race: 'BrooklynHalf'}).
            then(function (response) {
                $scope.photos = response.data.data.photos
                $scope.raceinfo = response.data.data.race_info
                $scope.reviews = response.data.data.reviews
            }, function (response) {
                console.log(response)
            }),
    ]).then(function () {
    })
})