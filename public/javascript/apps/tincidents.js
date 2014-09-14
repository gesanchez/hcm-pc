define([
    'jquery',
    'backbone',
    'routers/tincidentsRouter',
    'app'
], function ($, Backbone, Router, App) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, detail, data, count){
        
        var router = new Router({data: $.parseJSON(data), count: count, container: '#' + app_container, detail: '#' + detail});
        App.router = router;
        Backbone.history.start();
    };
    
    return {
        "_init" : init
    };
});