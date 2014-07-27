define([
    'underscore', 
    'backbone'
], function ( _, Backbone){
    'use strict';
    
    var Item = Backbone.Model.extend({
        defaults : {
            id : null,
            codigo: '',
            type: '',
            updateable: true,
            deletable: true,
            element : ''
        },
        urlRoot: '/inventario',
        idAttribute: 'id',
        validate : function(attrs, options){
            var errors = [];
            
            if (!attrs.titulo){
                errors.push({name: 'titulo', message: 'El campo titulo es requerido'});
            }
                      
            return errors.length > 0 ? errors : false;
        }
    });
    
    var Laptop = Backbone.Model.extend({
        defaults : {
            'id' : null,
            'type' : 1,
            'serial' : '',
            'pulgadas' : '',
            'disco' : '',
            'ram' : '',
            'marca' : '',
            'pro_velocidad' : '',
            'proc_modelo' : '',
            'proc_marca' : '',
            'user_asigned' : ''
        },
        url : '/inventario',
        validate : function(attrs, options){
            var errors = [];
            
            if (!attrs.serial){
                errors.push({name: 'serial', message: 'El campo serial es requerido'});
            }
            
            if (!attrs.pulgadas){
                errors.push({name: 'pulgadas', message: 'Se necesita saber las pulgadas'});
            }
            
            if (!attrs.disco){
                errors.push({name: 'disco', message: 'Se necesita saber la capacidad del disco duro'});
            }
            
            if (!attrs.ram){
                errors.push({name: 'ram', message: 'Se necesita saber cual es la capidad de la memoria ram'});
            }
            
            if (!attrs.marca){
                errors.push({name: 'marca', message: 'Cual es la marca'});
            }
            
            if (!attrs.pro_velocidad){
                errors.push({name: 'pro_velocidad', message: 'Se necesita saber cual es la velocidad del procesador'});
            }
            
            if (!attrs.proc_modelo){
                errors.push({name: 'proc_modelo', message: 'Se necesita saber cual es el modelo del procesador'});
            }
            
            if (!attrs.proc_marca){
                errors.push({name: 'mon_marca', message: 'Se necesita saber cual es la marca del procesador'});
            }
            
            if (!attrs.user_asigned){
                errors.push({name: 'user_asigned', message: 'Se debe selecionar una persona responsable'});
            }
                      
            return errors.length > 0 ? errors : false;
        }
    });
    
    var Type = Backbone.Model.extend({
        defaults : {
            type: ""
        }
    });
    
    var Pc = Backbone.Model.extend({
        defaults : {
            'id' : null,
            'type' : 2,
            'serial' : '',
            'disco' : '',
            'ram' : '',
            'proc_velocidad' : '',
            'proc_modelo' : '',
            'proc_marca' : '',
            'mon_marca' : '',
            'mon_pulgadas' : '',
            'teclado' : '',
            'mouse' : '',
            'user_asigned' : ''
        },
        url : '/inventario',
        validate : function(attrs, options){
            var errors = [];
            
            if (!attrs.serial){
                errors.push({name: 'serial', message: 'El campo serial es requerido'});
            }
            
            if (!attrs.disco){
                errors.push({name: 'disco', message: 'Se necesita saber la capacidad del disco duro'});
            }
            
            if (!attrs.ram){
                errors.push({name: 'ram', message: 'Se necesita saber la capacidad de la memoria ram'});
            }
            
            if (!attrs.proc_velocidad){
                errors.push({name: 'proc_velocidad', message: 'Se necesita saber cual es la velocidad del procesador'});
            }
            
            if (!attrs.proc_modelo){
                errors.push({name: 'proc_modelo', message: 'Se necesita saber cual es el modelo del procesador'});
            }
            
            if (!attrs.proc_marca){
                errors.push({name: 'proc_marca', message: 'Se necesita saber cual es la marca del procesador'});
            }
            
            if (!attrs.mon_marca){
                errors.push({name: 'mon_marca', message: 'Se necesita saber cual es la marca del monitor'});
            }
            
            if (!attrs.mon_pulgadas){
                errors.push({name: 'mon_pulgadas', message: 'Se necesita saber de cuantas pulgadas es el monitor'});
            }
            
            if (!attrs.mouse){
                errors.push({name: 'mouse', message: 'Se necesita saber la marca del mouse'});
            }
            
            if (!attrs.teclado){
                errors.push({name: 'teclado', message: 'Se necesita saber la marca del teclado'});
            }
            
            if (!attrs.user_asigned){
                errors.push({name: 'user_asigned', message: 'Se debe selecionar una persona responsable'});
            }
                      
            return errors.length > 0 ? errors : false;
        }
    });
    
    var itemsCollection = Backbone.Collection.extend({
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
        model : Item,
        url : '/inventario',
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
        Model : Item,
        Type : Type,
        Collection: itemsCollection,
        Laptop: Laptop,
        Pc : Pc
    };
});
