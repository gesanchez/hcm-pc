define(['jquery','models/userModel','views/usersView'], function ($, model, view) {
    'use strict';
    
    var init = function(container){
        var ele = $('#' + container),
            userCollection = new model.collection(),
            usersList = new view.list({collection : userCollection});
            
        usersList.render();
        ele.append(usersList.el);
    };
    
    return {
        "_init" : init
    };
});