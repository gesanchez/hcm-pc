define([
    'jquery',
    'models/profileModel',
    'views/profileView'
], function ($, Model, View) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, data){
        var ele = $('#' + app_container),
            model = new Model($.parseJSON(data)),
            view = new View({model : model});
            
        ele.html(view.el);
    };
    
    return {
        "_init" : init
    };
});