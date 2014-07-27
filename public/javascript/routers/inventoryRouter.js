define([
    'jquery',
    'underscore',
    'backbone',
    'models/inventoryModel',
    'views/inventoryView'
    ], function($, _, Backbone, Model, View) {
      
      'use strict';
      
        var Router = Backbone.Router.extend({
            routes: {
                "": "defaultAction",
                "addItem" : "addItem",
                "addPc" : "addPc",
                "addLaptop" : "addLaptop",
                "view/:id" : "view"
            },
            initialize: function(options){
                this.options = options || {};
                this.collection = (this.options.hasOwnProperty('data')) ? new Model.Collection(this.options.data) : new Model.Collection();
                this.collection.count = this.options.hasOwnProperty('count') ? this.options.hasOwnProperty.count : 0;
                this.app = new View.App({el: this.options.container, collection: this.collection, router: this});
                this.list = new View.List({collection : this.collection});
                this.listContainer = $(this.options.list);
                
                this.collection.on('destroy', function(){
                    this.app.research();
                }, this);
            },
            defaultAction: function(){    
                this.app.$el.find('div.page-header').show();
                this.listContainer.html(this.list.render().el);
                this.app.initial_state();
                this.app.showMore();
            },
            addItem: function(){
                this.app.$el.find('div.page-header').hide();
                var typeModel = new Model.Type(),
                    typeView = new View.Type({ model : typeModel, router : this});
                this.listContainer.html(typeView.render().el);
            },
            addLaptop: function(){
                var self = this;
                self.app.$el.find('div.page-header').hide();
                var LaptopModel = new Model.Laptop(),
                    LaptopAddView = new View.LaptopAdd({model: LaptopModel, users: self.options.users});
            
                self.listContainer.html(LaptopAddView.render().el);
                
                LaptopAddView.on('laptop:save', function(object){
                    self.collection.add(new Model.Model(object));
                });
            },
            addPc: function(){
                var self = this;
                self.app.$el.find('div.page-header').hide();
                var PcModel = new Model.Pc(),
                    PcAddView = new View.PcAdd({model: PcModel, users: self.options.users});
                    
                self.listContainer.html(PcAddView.render().el);
                
                PcAddView.on('pc:save', function(object){
                    self.collection.add(new Model.Model(object));
                });
            },
            view: function(id){
                var self = this;
                self.app.$el.find('div.page-header').hide();
                var ele = self.collection.find(function(element){
                    return id === element.id;
                });
                
                if (ele !== undefined){

                    if (ele.get('type') == 1){
                        
                        var LaptopView = new View.LaptopView({model: new Model.Laptop(ele.get('element'))});
                        self.listContainer.html(LaptopView.el);
                        
                    }else if(ele.get('type') == 2){

                        var PcView = new View.PcView({model: new Model.Pc(ele.get('element'))});
                        self.listContainer.html(PcView.el);
                        
                    }
                }
            }
        });
        
        return Router;
    
});