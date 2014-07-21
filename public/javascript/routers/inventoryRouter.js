define([
    'jquery',
    'underscore',
    'backbone'
    ], function($, _, Backbone) {
   
        var Router = Backbone.Router.extend({
            routes: {
                "": "defaultAction",
                "addItem" : "addItem"
            },
            initialize: function(options){
                this.options = options || {};
            },
            defaultAction: function(){                
                this.options.el.append(this.options.collection);
            },
            addItem: function(){
                this.options.collection.$el.remove();
            }
        });
        
        return Router;
    
});