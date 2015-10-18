activityModule.service('LoginService', function ($modal, $rootScope) {

    function assignCurrentUser(user) {
        $rootScope.currentUser = user;
        return user;
    }

    return function () {
        var instance = $modal.open({
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })

        return instance.result.then(assignCurrentUser);
    };

}).controller('LoginCtrl', function ($http, $scope, $rootScope) {
    $scope.login = function () {
        $http({
            url: '/auth/login/',
            method: 'POST',
            data: {
                'username': $scope.username,
                'password': $scope.password
            }
        }).then(function (response) {
            if(response.data.status == 'SUCCESS')
            {
                $rootScope.currentUser = $scope.username;
                $scope.$close($rootScope.currentUser)
                $scope.error = ''
            }
            else{
                $scope.error = "Username or Password is Incorrect"
            }
        }, function (error) {
            alert(error.data);
        })
    };
});