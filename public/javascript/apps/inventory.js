define([
    'jquery',
    'routers/inventoryRouter',
    'backbone',
    'app'
], function ($, Router, Backbone, App) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, detail, data, count, users){
        
        var router = new Router({data: $.parseJSON(data), count: count, container: '#' + app_container, list: '#' + detail, users : $.parseJSON(users)});
        App.router = router;
        Backbone.history.start();
    };
        
    return {
        "_init" : init
    };
});