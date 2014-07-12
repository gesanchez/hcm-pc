define([    
    'jquery',
    'underscore',
    'backbone',
    'text!templates/general/deleteElement.html',
], function($, _, Backbone, Template){
    
    var Modal = Backbone.View.extend({
        tagName : 'div',
        className : 'modal fade',
        template : _.template(Template),
        attributes : {
            tabindex : "-1",
            role : "dialog",
            'aria-labelledby' : "myModalLabel",
            'aria-hidden' : "true"
        },
        events: {
            'click button[name="delete"]' : function(){ this.trigger('msg:response', true); return true; },
            'click button[name="cancel"]' : function(){ this.trigger('msg:response',false); return true; }
        },
        show: function(obj){
            var msg = obj || {title: '', msg: ''};
            this.$el.html(this.template(msg)).modal();
        }
    });
    
    _.extend(Modal, Backbone.Events);
    
    var modal = new Modal();
    $('body').append(modal.el);
    
    return modal;
});