activityModule.controller('DemoCtrl', function($scope, $http, $rootScope, $location, $q, messages) {

    $scope.countries = [
        {name: 'Rourkela', lat: 22.251456, long:84.880236 },
        {name: 'Boston', lat: 42.3601, long:-71.0589 }
    ];
    $scope.selected = {};
    $scope.selected.cities = [];

    $scope.submitInfo = function(){


        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng($scope.selected.cities[0].lat,$scope.selected.cities[0].long),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        $scope.markers = [];
        $scope.movingMarker = [];
        for (var i = 0; i <  $scope.selected.cities.length; i++){
            createMarker($scope.selected.cities[i]);
        }
        //animateMarker($scope.markers[0],$scope.movingMarker)

        $q.all([
            $http.post('/api/getPlacesFromYelp',{'places' : $scope.selected.cities }).
                then(function(response) {
                    console.log(response.data.yelpReply)
                    messages.addYelpResults(response.data.yelpReply)
                }, function(response) {
                    console.log(response)
                }),
            $http.post('/api/getPlaces',{'places' : $scope.selected.cities }).
                then(function(response) {
                    messages.addInstagramResults(response.data.instareply)
                }, function(response) {
                    console.log(response)
                }),
        ]).then(function(){
            $location.path('places')
        })

    }

    $scope.results = []
    var delay = 100;

    var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.name
        });
        $scope.movingMarker.push([info.lat,info.long])
        $scope.markers.push(marker);
    }
    function animateMarker(marker, coords)
    {
        var target = 0;
        var km_h = 5000;
        coords.push([coords[0].lat, coords[1].lng]);

        function goToPoint()
        {
            var lat = marker.position.lat();
            var lng = marker.position.lng();
            var step = (km_h * 1000 * delay) / 3600000; // in meters

            var dest = new google.maps.LatLng(
                coords[target][0], coords[target][1]);

            var distance =
                100 // in meters

            var numStep = distance / step;
            var i = 0;
            var deltaLat = (coords[target][0] - lat) / numStep;
            var deltaLng = (coords[target][1] - lng) / numStep;

            function moveMarker()
            {
                lat += deltaLat;
                lng += deltaLng;
                i += step;

                if (i < distance)
                {
                    marker.setPosition(new google.maps.LatLng(lat, lng));
                    setTimeout(moveMarker, delay);
                }
                else
                {   marker.setPosition(dest);
                    target++;
                    if (target == coords.length){ target = 0; }

                    setTimeout(goToPoint, delay);
                }
            }
            moveMarker();
        }
        goToPoint();
    }
});


