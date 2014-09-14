define([
    'jquery',
    'underscore',
    'backbone',
    'models/tincidentsModel',
    'views/tincidentsView'
    ], function($, _, Backbone, Model, View) {
      
      'use strict';
      
        var Router = Backbone.Router.extend({
            routes: {
                "": "defaultAction",
                "view/:id": "view",
                "informe/:id": "informe"
            },
            initialize: function(options){
                this.options = options || {};
                this.collection = (this.options.hasOwnProperty('data')) ? new Model.Collection(this.options.data) : new Model.Collection();
                this.collection.count = this.options.hasOwnProperty('count') ? this.options.hasOwnProperty.count : 0;
                this.app = new View.App({el: this.options.container, collection: this.collection, router: this});
                this.list = new View.List({collection : this.collection, el: this.options.detail});
                this.actElement = null;
                
            },
            defaultAction: function(){    
                var self = this,
                    view = new View.View({model: new Model.Model}),
                    informe = new View.Informe({model: new Model.Model});
                self.list.render();
                self.app.$el.append(view.el);
                self.viewInformation = view;
                self.informe = informe;
            },
            view: function(id){
                
                if (this.viewInformation === undefined){ this.defaultAction(); }
                
                var collection = this.collection.get(id);
                
                this.viewInformation.model.clear({silent: true});
                this.viewInformation.model.set(collection.attributes);
                
                this.viewInformation.$el.modal();
            },
            informe: function(id){
                
                if (this.viewInformation === undefined){ this.defaultAction(); }
                
                var collection = this.collection.get(id);
                
                this.informe.model.clear({silent: true});
                this.informe.model.set(collection.attributes);
                
                this.informe.$el.modal();
                
                this.informe.model.on('change:informe', function(model){
                    collection.set({'informe' : model.get('informe'), 'estatus' : 3});
                    collection.save(null);
                });
            }
        });
        
        return Router;
    
});