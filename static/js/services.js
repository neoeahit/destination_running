activityModule.factory('messages', function(){
    var messages = {};

    messages.instagramResults = {};
    messages.yelpResults = {};

    messages.addInstagramResults = function(message){
        messages.instagramResults = message
    };

    messages.addYelpResults = function(message){
        messages.yelpResults = message
    };

    return messages;
});