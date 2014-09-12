define([
    'jquery',
    'models/gincidentsModel',
    'views/gincidentsView'
], function ($, Model, View) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, detail, data, count){
        var ele = $('#' + app_container),
            list = $('#' + detail),
            Collection = new Model.Collection($.parseJSON(data));
            Collection.total = count;
            
        var App = new View.App({el: '#' + app_container, collection: Collection}),
            List = new View.List({collection : Collection, el: '#' + detail});
            
        List.render();
        
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