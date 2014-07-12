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
            'rpt_password' : ''
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
                      
            return errors.length > 0 ? errors : false;
        }
    });
    
    return User;
});
