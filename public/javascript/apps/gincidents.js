define([
    'jquery',
    'backbone',
    'routers/gincidentsRouter',
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
        
//        var ele = $('#' + app_container),
//            list = $('#' + detail),
//            Collection = new Model.Collection($.parseJSON(data)),
//            userCollection = new Model.UserCollection(),
//            userview = new View.User({collection: userCollection, information: Collection});
//            Collection.total = count;
//            
//        var App = new View.App({el: '#' + app_container, collection: Collection}),
//            List = new View.List({collection : Collection, el: '#' + detail, usersView: userview});
//            
//        List.render();
//        ele.append(userview.el);
        
//        /* Observer when a problem is removed */
//        problemList.on('element:destory', function(){
//            problemApp.research();
//        });
//        
//        /* Observer event from add view */
//        problemAdd.on('problem:save', function(object){
//            problemCollection.total = problemCollection.total + 1;
//            problemCollection.add(new Model.Model(object));
//            problemAdd.$el.modal('hide');
//        });
//        
//        /* Observer when a problem is update */
//        problemEdit.on('problem:update', function(attrs){
//            var element = problemCollection.get(attrs.id);
//            element.set(attrs);
//            problemEdit.$el.modal('hide');
//        });
    };
    
    return {
        "_init" : init
    };
});