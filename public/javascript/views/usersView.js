define(['jquery','underscore','backbone','text!templates/users.html'],function($, _, Backbone, template){
    'use strict';
    
    var ListUsers = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        initialize : function(){
            var self = this;
            
        },
        addItem : function(item){
            var user = new User({ model: item });
            this.$el.append(user.el);
        },
        render: function(){
            $(this.el).empty();
            this.collection.each(function(user){
                this.addItem(user);
            }, this);
        }
    });
    
    var User = Backbone.View.extend({
        tagName : 'div',
        className : 'col-xs-4',
        template: _.template(template),
        attributes : {
            'style' : 'position: relative;'
        },
        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('remove', this.removeElement, this);
            this.render();
        },
        render: function(){
            this.$el.html( this.template(this.model.toJSON()));
        },
        removeElement : function(){
            this.$el.remove();
        }
    });
    
    return {
        list : ListUsers,
        user : User
    };
});