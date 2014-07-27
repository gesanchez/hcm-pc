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
            list = $('#' + detail),
            problemAdd = new View.Add({model: new Model.Model()}),
            problemEdit = new View.Edit({model: new Model.Model()}),
            problemView = new View.View({model: new Model.Model()}),
            problemCollection = new Model.Collection($.parseJSON(data));
            problemCollection.total = count;
            
        var problemApp = new View.App({el: '#' + app_container, collection: problemCollection, addview : problemAdd}),
            problemList = new View.List({collection : problemCollection, view: problemView, edit: problemEdit});
            
        problemApp.$el.append(problemAdd.el);
        problemList.render();
        list.append(problemList.el);
        
        /* Observer when a problem is removed */
        problemList.on('element:destory', function(){
            problemApp.research();
        });
        
        /* Observer event from add view */
        problemAdd.on('problem:save', function(object){
            problemCollection.total = problemCollection.total + 1;
            problemCollection.add(new Model.Model(object));
            problemAdd.$el.modal('hide');
        });
        
        /* Observer when a problem is update */
        problemEdit.on('problem:update', function(attrs){
            var element = problemCollection.get(attrs.id);
            element.set(attrs);
            problemEdit.$el.modal('hide');
        });
    };
    
    return {
        "_init" : init
    };
});