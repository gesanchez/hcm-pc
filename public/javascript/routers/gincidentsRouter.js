define([
    'jquery',
    'underscore',
    'backbone',
    'models/gincidentsModel',
    'views/gincidentsView'
    ], function($, _, Backbone, Model, View) {
      
      'use strict';
      
        var Router = Backbone.Router.extend({
            routes: {
                "": "defaultAction",
                "asignacion/:id": "asignation",
                "view/:id": "view"
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
                var userCollection = new Model.UserCollection(),
                    self = this,
                    userview = new View.User({collection: userCollection}),
                    view = new View.View({model: new Model.Model});
                    
                self.list.render();
                self.app.$el.append(userview.el);
                self.app.$el.append(view.el);
                
                self.userView = userview;
                self.userCollection = userCollection;
                self.viewInformation = view;
                
                self.userCollection.on('change:selected', function(model){
                   
                    if (self.actElement !== null){
                        if (model.get('selected') === true){
                            self.actElement.set('tecnico', model);
                        }else{
                            self.actElement.set('tecnico', null);
                        }
                        
                        self.userCollection.each(function(user){
                            if (user.id != model.id){
                                user.set('selected', false,{silent: true});
                                user.trigger('repaint');
                            }
                        });
                        
                        self.actElement.save(null);
                    }
                });
                
            },
            asignation: function(id){
                var self = this;
                if (self.userView === undefined){ this.defaultAction(); }
                
                var collection = this.collection.get(id);
                
                if (collection.get('tecnico') !== null && collection.get('tecnico') !== ''){
                    var even = this.userCollection.find(function(element){
                        return collection.get('tecnico').id == element.id;
                    });
                   
                    
                    if (even !== undefined){ even.set('selected',true); }
                }
                
                this.actElement = collection;
                                
                self.userView.$el.modal();
            },
            view: function(id){
                
                if (this.viewInformation === undefined){ this.defaultAction(); }
                
                var collection = this.collection.get(id);
                
                this.viewInformation.model.clear({silent: true});
                this.viewInformation.model.set(collection.attributes);
                
                this.viewInformation.$el.modal();
            }
        });
        
        return Router;
    
});