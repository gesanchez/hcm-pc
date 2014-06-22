define(['underscore', 'backbone'], function ( _, Backbone){
    'use strict';
    
    var User = Backbone.Model.extend({
        defaults : {
            id : null,
            cedula: '',
            first_name: '',
            last_name: '',
            photo: ''
        },
        urlRoot: '/usuarios',
        idAttribute: '_id',
        validate: function(attrs, options){

        }
    });
        
    var UserCollection = Backbone.Collection.extend({
        initialize: function() {
            this.page = 0;
            this.limit = 30;
            this.count = 0;
        },
        parse: function(response) {
            this.count = response.count;
            return response.data;
        },
        model : User,
        url : '/usuarios'
    });
    
    return {
        collection : UserCollection,
        model : User
    };
});
