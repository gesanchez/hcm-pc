define([
    'jquery',
    'models/problemModel',
    'views/problemView'
], function ($, Model, View) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, detail, data, count){
        var ele = $('#' + app_container),
            problemAdd = new View.Add({model: new Model.Model()}),
            problemCollection = new Model.Collection($.parseJSON(data));
            problemCollection.total = count;
            
        var problemApp = new View.App({el: '#' + app_container, collection: problemCollection, addview : problemAdd}),
            problemList = new View.List({collection : problemCollection});
            
        problemApp.$el.append(problemAdd.el);
        problemList.render();
        ele.append(problemList.el);
        
        /* Observer when a user is removed */
        problemList.on('element:destory', function(){
            problemApp.research();
        });
        
        /* Observer event from add view */
        problemAdd.on('problem:save', function(object){
           problemCollection.add(new Model.Model(object));
           problemAdd.$el.modal('hide');
        });
    };
    
    return {
        "_init" : init
    };
});