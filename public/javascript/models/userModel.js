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
            'rpt_password' : '',
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

            if (attrs.cedula && attrs.cedula.length < 6){
                errors.push({name: 'cedula', message: 'El campo cedula debe contener al menos 6 numeros'});
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
                errors.push({name: 'password', message: 'El campo clave es requerido'});
            }
            
            if(attrs.password && attrs.password.length < 6){
                errors.push({name: 'password', message: 'La clave debe contener al menos 6 caracteres'});
            }
            
            if (!attrs.rpt_password){
                errors.push({name: 'rpt_password', message: 'Debe repetir la clave'});
            }
            
            if (attrs.rpt_password && attrs.password && attrs.password !== attrs.rpt_password){
                errors.push({name: 'password', message: 'Las claves no coinciden'});
            }
           
            return errors.length > 0 ? errors : false;
        }
    });
        
    var UserCollection = Backbone.Collection.extend({
        initialize: function(object) {
            var obj = object || {};
            this.page = 1;
            this.limit = 30;
            this.total = obj.total || 0;
        },
        parse: function(response) {
            this.total = response.total;
            return response.data;
        },
        model : User,
        url : '/usuarios',
        search : function(parameters, callback){
            var self = this,
                params = _.extend(parameters, {page: 0, limit : self.limit});
            self.page = 0;
            self.fetch({ remove: true, data: params }).always(function() {
                self.page = self.page + 1;
                if (callback){ callback(); }
            });
        },
        paginate : function(parameters){
            var self = this,
                params = _.extend(parameters, {page: self.page, limit : self.limit});
            self.fetch({ remove: false, data: params }).always(function() {
                self.page = self.page + 1;
            });
        }
    });
    
    return {
        collection : UserCollection,
        model : User
    };
});
