define(['jquery','models/userModel','views/usersView'], function ($, model, view) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, container_list, data, count){
        var ele = $('#' + container_list),
            userAdd = new view.add({model: new model.model()}),
            userView = new view.view({model: new model.model()}),
            userCollection = new model.collection($.parseJSON(data));
            userCollection.total = count;
        var userApp = new view.app({el: '#' + app_container, addview : userAdd, collection: userCollection}),
            usersList = new view.list({collection : userCollection, view : userView});
        
        userApp.$el.append(userAdd.el);
        usersList.render();
        ele.append(usersList.el);
        
        /* Observer event from add view */
        userAdd.on('user:save', function(object){
           userCollection.add(new model.model(object));
           userAdd.$el.modal('hide');
        });
        
        /* Observer when a user is removed */
        usersList.on('element:destory', function(){
            userApp.research();
        });
    };
    
    return {
        "_init" : init
    };
});