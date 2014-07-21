define([
    'app',
    'jquery',
    'models/inventoryModel',
    'views/inventoryView',
    'backbone'
], function (App,$, Model, View, Backbone) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, detail, data, count){
        var ele = $('#' + app_container),
            problemAdd = new View.Add({model: new Model.Model()}),
            problemEdit = new View.Edit({model: new Model.Model()}),
            problemView = new View.View({model: new Model.Model()}),
            problemCollection = new Model.Collection($.parseJSON(data));
            problemCollection.total = count;
            
        var problemApp = new View.App({el: '#' + app_container, collection: problemCollection, addview : problemAdd}),
            inventoryList = new View.List({collection : problemCollection, view: problemView, edit: problemEdit});
            
        problemApp.$el.append(problemAdd.el);
        inventoryList.render();
        ele.append(inventoryList.el);
        
        /* Observer when a problem is removed */
        inventoryList.on('element:destory', function(){
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
        
         
        App.router.route('','defaultAction', function(){
            console.log('asdasd');
        });
        App.router.route('addItem','addItem');

        App.router.on('route:addItem', function(){
            console.log('asd');
            inventoryList.$el.remove();
        });

        App.router.on('route:defaultAction', function(){
            console.log('asdasd');
            ele.append(inventoryList.el);
        });
        
        console.log(Backbone.history.fragment);
        App.router.navigate(Backbone.history.fragment, {trigger: true});
        
    };
        
    return {
        "_init" : init
    };
});