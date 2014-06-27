define(['jquery','underscore','backbone','text!templates/users/users.html', 'text!templates/users/usersAdd.html'],function($, _, Backbone, template, TemplateAdd){
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
            var self = this;
            $(this.el).empty();
            this.collection.each(function(user){
                self.addItem(user);
            }, this);
        }
    });
    
    var User = Backbone.View.extend({
        tagName : 'div',
        className : 'col-xs-3 col-md-3',
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
    
    var UserAdd = Backbone.View.extend({
        tagName : 'div',
        className : 'modal fade',
        template : _.template(TemplateAdd),
        attributes : {
            tabindex : "-1",
            role : "dialog",
            'aria-labelledby' : "myModalLabel",
            'aria-hidden' : "true"
        },
        initialize: function(){
            this.render();
        },
        events : {
            'click button[name="guardar"]' : 'save',
            'keydown input[type="text"][name="cedula"]' : 'onlyNumber',
            'keydown input[type="text"][name="nombre"],input[type="text"][name="apellido"]' : 'onlyCharacter'
        },
        render : function(){
            this.$el.html(this.template(this.model.toJSON()));
        },
        save : function(){
            var self = this;
            self.$el.find('input:text, select, input:password').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
            
            if (!self.model.isValid()) {
                self.showErrors(self.model.validationError);
            }else{
                self.model.save(null,{
                    success : function(model,xhr){ 
                        if (xhr.data.success === 1){

                        }
                    },
                    error : function(){

                    }
                });
            }
        },
        onlyNumber : function(e){
            var key = e.which;
            if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || (key >= 37 && key <= 40) || key === 27)){
                e.preventDefault();
            }
        },
        onlyCharacter : function(e){
            var key = e.which;
            if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)){
                e.preventDefault();
            }
        },
        showErrors: function(errors) {
            var self = this;
            _.each(errors, function (error) {
                var input = self.$el.find('input[name="'+error.name+'"]'),
                    parent = input.parent();
                parent.addClass('has-error');
                parent.find('.help-inline').text(error.message);
            });
        },
 
        hideErrors: function () {
            this.$el.find('.form-group').removeClass('has-error');
            this.$el.find('.help-inline').text('');
        }
    });
    
    _.extend(UserAdd, Backbone.Events);
    
    var UserApp = Backbone.View.extend({
        initialize : function (options) {
            this.options = options || {};
        },
        events : {
            'click button[name= "adduser"]' : 'addUser'
        },
        addUser : function(){
            if (this.options.hasOwnProperty('addview')){
                this.options.addview.$el.modal();
            }
        }
    });
    
    return {
        list : ListUsers,
        user : User,
        add : UserAdd,
        app : UserApp
    };
});