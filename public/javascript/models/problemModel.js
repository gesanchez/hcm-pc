define([
    'underscore', 
    'backbone'
], function ( _, Backbone){
    'use strict';
    
    var Problem = Backbone.Model.extend({
        defaults : {
            id : null,
            titulo: '',
            resolucion: ''
        },
        urlRoot: '/problemas',
        idAttribute: 'id',
        validate : function(attrs, options){
            var errors = [];
            
            if (!attrs.titulo){
                errors.push({name: 'titulo', message: 'El campo titulo es requerido'});
            }
                      
            return errors.length > 0 ? errors : false;
        }
    });
    
    var ProblemCollection = Backbone.Collection.extend({
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
        model : Problem,
        url : '/problemas',
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
        Model : Problem,
        Collection: ProblemCollection
    };
});
