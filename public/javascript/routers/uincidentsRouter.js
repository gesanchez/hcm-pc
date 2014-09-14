define([
    'jquery',
    'underscore',
    'backbone',
    'models/uincidentsModel',
    'views/uincidentsView'
    ], function($, _, Backbone, Model, View) {
      
      'use strict';
      
        var Router = Backbone.Router.extend({
            routes: {
                "": "defaultAction",
                "view/:id": "view",
                "new" : 'new'
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
                    add = new View.Add({model: new Model.Model});
                self.list.render();
                self.app.$el.append(view.el);
                self.app.$el.append(add.el);
                self.viewInformation = view;
                self.add = add;
            },
            view: function(id){
                
                if (this.viewInformation === undefined){ this.defaultAction(); }
                
                var collection = this.collection.get(id);
                
                this.viewInformation.model.clear({silent: true});
                this.viewInformation.model.set(collection.attributes);
                
                this.viewInformation.$el.modal();
            },
            new: function(){
                var self = this;
                if (self.add === undefined){ self.defaultAction(); }
                
                self.add.$el.modal();
                
                self.add.on('incident:save', function(object){
                    self.collection.total = self.collection.total + 1;
                    self.collection.add(new Model.Model(object));
                });
            }
        });
        
        return Router;
    
});