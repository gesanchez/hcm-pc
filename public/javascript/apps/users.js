define(['jquery','models/userModel','views/usersView'], function ($, model, view) {
    'use strict';
    
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(app_container, container_list, data){
        var ele = $('#' + container_list),
            userAdd = new view.add({model: new model.model()}),
            userApp = new view.app({el: '#' + app_container, addview : userAdd}),
            userCollection = new model.collection($.parseJSON(data)),
            usersList = new view.list({collection : userCollection});
        
        userApp.$el.append(userAdd.el);
        usersList.render();
        ele.append(usersList.el);
    };
    
    return {
        "_init" : init
    };
});