define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/problems/problem.html',
    'text!templates/problems/addProblem.html',
    'views/deleteView',
],function($, _, Backbone, Template, TemplateAdd, Msg){
    'use strict';
    
    var ProblemList = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        initialize : function(options){
            var self = this;
            self.options = options || {};
            self.collection.on('add', self.addItem, self);
            self.collection.on('destroy', self.removeItem, self);
        },
        addItem : function(item){
            var problem = new Problem({ model: item, view : this.options.view, edit: this.options.edit });
            this.$el.append(problem.el);
        },
        removeItem: function(){
            this.trigger('element:destory');
        },
        render: function(){
            var self = this;
            $(this.el).empty();
            this.collection.each(function(user){
                self.addItem(user);
            }, this);
            
            return this;
        }
    });
    
    _.extend(ProblemList, Backbone.Events);
    
    var Problem = Backbone.View.extend({
        tagName : 'div',
        className : 'col-xs-12 col-sm-6 col-md-6 col-lg-3',
        template: _.template(Template),
        attributes : {
            'style' : 'position: relative;margin-bottom: 30px'
        },
        initialize: function(options){
            this.options = options || {};
            this.model.on('change', this.render, this);
            this.model.on('remove', this.removeElement, this);
            this.render();
        },
        render: function(){
            this.$el.html( this.template(this.model.toJSON()));
            this.$el.find('span.glyphicon-cog').tooltip();
        },
        events : {
            'click a[data-name="view"]' : 'showInformation',
            'click a[data-name="delete"]' : 'destroyElement',
            'click a[data-name="edit"]' : 'editElement'
        },
        showInformation : function(e){
            e.preventDefault();
            this.options.view.model.set(this.model.attributes);
            this.options.view.$el.modal();
        },
        destroyElement : function(e){
            e.preventDefault();
            var target = $(e.target),
                self = this,
                parent = target.parent().addClass('hidden');
            Msg.show({title: 'Eliminar problema',msg: 'Desea usted eliminar este problema?'});
            Msg.on('msg:response', function(res){
                if (res){
                    self.model.destroy({
                        success: function(model, response) {
                            self.$el.remove();
                        },
                        error: function(){
                            parent.removeClass('hidden');
                        }
                    });
                }else{
                    parent.removeClass('hidden');
                }
            });
        },
        editElement: function(e){
            e.preventDefault();
            this.options.edit.model.set(this.model.attributes);
            this.options.edit.hiddenValidationError();
            this.options.edit.$el.modal();
        },
        removeElement : function(e){
            this.$el.remove();
        }
    });
    
    var ProblemApp = Backbone.View.extend({
        initialize : function (options) {
            this.options = options || {};
            this.show = false;
            this.$el.find('button[name="addproblem"]').tooltip();
            this.collection.on('remove', this.showMore, this);
            this.collection.on('add', this.showMore, this);
            this.showMore();
            this.initial_state();
        },
        events : {
            'click button[name= "addproblem"]' : 'addProblem',
            'keydown input:text[name="find_problem"]' : 'stopSearch',
            'keyup input:text[name="find_problem"]' : 'startSearch',
            'click button[name="show_more"]' : 'paginate',
            'click button[name="create_problem"]' : 'addProblem'
        },
        addProblem : function(){
            if (this.options.hasOwnProperty('addview')){
                this.options.addview.model.set(this.options.addview.model.defaults);
                this.options.addview.$el.modal();
            }
        },
        stopSearch : function(e){
            var self = this,
                target = $(e.target);
        
            if (target.data('timer') !== undefined){
                clearTimeout(target.data('timer'));
                target.removeData('timer');
            }
        },
        startSearch : function(e) {
            var self = this,
                target = $(e.target);
        
            if (target.data('timer') !== undefined){
                clearTimeout(target.data('timer'));
                target.removeData('timer');
            }
            
            var timer = setTimeout(function(){
                self.$el.find('div[data-name="nofound"]').remove();
                self.collection.search({term : decodeURIComponent(target.val())}, function(){
                    if (self.collection.length === 0){
                        self.$el.append('<div style="text-align: center;margin-bottom: 20px" data-name="nofound"><h3>No se encontraron registros</h3></div>');
                    }
                });
            },500);
            
            target.data('timer', timer);
        },
        showMore: function(){
            var self = this;
            if (self.collection.length < self.collection.total){
                if (this.show === false){
                    this.show = true;
                    self.$el.append('<div style="text-align: center;margin-bottom: 20px"><button class="btn" type="button" name="show_more">Ver mas</button></div>');
                }
            }else{
                this.show = false;
                self.$el.find('button[name="show_more"]').remove();
            }
        },
        initial_state: function(){
            var self = this;
            if (self.collection.length === 0){
                self.$el.append('<div style="text-align: center;margin-bottom: 20px"><p class="lead">No exite un problema t&iacute;pico creado aun</p><button class="btn" type="button" name="create_problem">Crear</button></div>');
            }else{
                
                self.$el.find('button[name="create_problem"]').parent().remove();
            }
        },
        research: function(){
            var target = this.$el.find('input:text[name="find_problem"]'),
                self = this;
            self.collection.search({term : decodeURIComponent(target.val())});
        },
        paginate: function(){
            var target = this.$el.find('input:text[name="find_problem"]');
            this.collection.paginate({term : decodeURIComponent(target.val())});
        }
    });
    
    var ProblemAdd = Backbone.View.extend({
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
            this.model.on('change', this.render, this);
        },
        events : {
            'click button[name="save"]' : 'save'
        },
        render : function(){
            this.$el.html(this.template(this.model.toJSON()));
        },
        save : function(){
            var self = this;
            
            this.hiddenValidationError();
            this.hideErrors();
            
            self.$el.find('input:text, textarea').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
            
            if (!self.model.isValid()) {
                self.showErrors(self.model.validationError);
            }else{
                self.$el.find('button[name="save"]').prop('disabled',true);
                self.model.save(null,{
                    success : function(model,xhr){ 
                        self.$el.find('button[name="save"]').prop('disabled',false);
                        if (xhr.ok === true){
                            self.trigger("problem:save", xhr);
                        }else if (xhr.ok === false){
                            self.showValidationError(xhr.message);
                        }
                    },
                    error : function(){
                        self.$el.find('button[name="save"]').prop('disabled',false);
                        self.showValidationError('Ocurrio un error al intentar guardar, intente nuevamente');
                    }
                });
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
        },
        showValidationError: function(message){
            this.$el.find('p[data-name="message_validation"]').text(message).removeClass('hidden');
        },
        hiddenValidationError: function(){
            this.$el.find('p[data-name="message_validation"]').text('').addClass('hidden');
        }
    });
    
    _.extend(ProblemAdd, Backbone.Events);
    
    return {
        List : ProblemList,
        View : Problem,
        App : ProblemApp,
        Add : ProblemAdd
    };
});