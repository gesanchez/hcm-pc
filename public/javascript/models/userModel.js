define(['underscore', 'backbone'], function ( _, Backbone){
    'use strict';
    
    var User = Backbone.Model.extend({
        defaults : {
            id : null,
            cedula: '',
            nombre: '',
            apellido: '',
            foto: '',
            rol : '',
            password : '',
            deletable: false,
            updateable: false
        },
        urlRoot: '/usuarios',
        idAttribute: 'id',
        validate : function(attrs, options){
            var errors = [];
            
            if (!attrs.cedula){
                errors.push({name: 'cedula', message: 'El campo cedula es requerido'});
            }
            
            if (!attrs.nombre){
                errors.push({name: 'nombre', message: 'El campo nombre es requerido'});
            }
            
            if (!attrs.apellido){
                errors.push({name: 'apellido', message: 'El campo apellido es requerido'});
            }
            
            if(!attrs.rol){
                errors.push({name: 'rol', message: 'Se debe seleccionar un grupo'});
            }
            
            if(!attrs.password){
                errors.push({name: 'password', message: 'El campo password es requerido'});
            }
           
            return errors.length > 0 ? errors : false;
        }
    });
        
    var UserCollection = Backbone.Collection.extend({
        initialize: function() {
            this.page = 0;
            this.limit = 30;
            this.total = 0;
        },
        parse: function(response) {
            this.total = response.total;
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
