define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/general/incidents.html'
],function($, _, Backbone, Template){
    
    var IncidentList = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        initialize : function(options){
            var self = this;
            self.options = options || {};
            //self.collection.on('add', self.addItem, self);
        },
        addItem : function(item){
            var problem = new Incident({ model: item});
            this.$el.append(problem.el);
        },
        render: function(){
            var self = this;
            $(this.el).empty();
            this.collection.each(function(user){
                self.addItem(user);
            }, this);
            
            if (this.collection.length === 0){
                self.$el.append('<p style="text-align: center">No hay incidentes que mostrar aun</p>');
            }
            
            return this;
        }
    });
    
    var Incident = Backbone.View.extend({
        tagName : 'div',
        className : 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        template: _.template(Template),
        attributes : {
            'style' : 'position: relative;margin-bottom: 10px'
        },
        initialize: function(options){
            this.options = options || {};
            this.render();
            
            this.$el.find('i[data-toggle="tooltip"]').tooltip();
        },
        render: function(){
            this.$el.html( this.template(this.model.toJSON()));
        },
        showInformation : function(e){
            e.preventDefault();
            this.options.view.model.set(this.model.attributes);
            this.options.view.$el.modal();
        }
    });
    
    return {
        Collection: IncidentList,
        View: Incident
    };
});