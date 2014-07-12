define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/users/users.html', 
    'text!templates/users/usersAdd.html', 
    'text!templates/users/userView.html',
    'text!templates/users/usersEdit.html',
    'views/deleteView',
    'transport'
],function($, _, Backbone, template, TemplateAdd, TemplateView, TemplateEdit, Msg){
    'use strict';
    
    var ListUsers = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        initialize : function(options){
            var self = this;
            self.options = options || {};
            self.collection.on('add', self.addItem, self);
            self.collection.on('destroy', self.removeItem, self);
        },
        addItem : function(item){
            var user = new User({ model: item, view : this.options.view, edit: this.options.edit });
            this.$el.append(user.el);
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
        }
    });
    
    _.extend(ListUsers, Backbone.Events);
    
    var User = Backbone.View.extend({
        tagName : 'div',
        className : 'col-xs-12 col-sm-6 col-md-6 col-lg-3',
        template: _.template(template),
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
            Msg.show({title: 'Eliminar usuario',msg: 'Desea usted eliminar este usuario?'});
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
            this.model.on('change', this.render, this);
            this.ajax = null;
        },
        events : {
            'click button[name="guardar"]' : 'save',
            'keydown input[type="text"][name="cedula"]' : 'onlyNumber',
            'keydown input[type="text"][name="nombre"],input[type="text"][name="apellido"]' : 'onlyCharacter',
            'submit form' : 'uploadImage',
            'click button[name="change_image"]': 'changeImage',
            'change input:file' : 'validateImage',
            'click button[name="close"],span[data-name="close"]' : 'cancelUpload'
        },
        render : function(){
            var model = _.extend({token: $('meta[name="csrf-token"]').attr('content')},this.model.toJSON());
            this.$el.html(this.template(model));
            this.$el.find('*[data-toggle="tooltip"]').tooltip();
        },
        save : function(){
            var self = this;
            
            this.hiddenValidationError();
            
            self.$el.find('input:text, select, input:password').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
            
            if (!self.model.isValid()) {
                self.showErrors(self.model.validationError);
            }else{
                self.$el.find('button[name="guardar"]').prop('disabled',true);
                self.model.save(null,{
                    success : function(model,xhr){ 
                        self.$el.find('button[name="guardar"]').prop('disabled',false);
                        if (xhr.ok === true){
                            self.trigger("user:save", xhr);
                        }else if (xhr.ok === false){
                            self.showValidationError(xhr.message);
                        }
                    },
                    error : function(){
                        self.$el.find('button[name="guardar"]').prop('disabled',false);
                        self.showValidationError('Ocurrio un error al intentar guardar, intente nuevamente');
                    }
                });
            }
        },
        validateImage: function(e){
            var self = this,
                target = e.target;
                
            if (target.files[0] !== undefined){
                var extension = target.files[0].name.split('.').pop().toLowerCase();
                if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png'){
                    self.$el.find('p.text-danger').text('Solo se permiten imagenes de tipo jpg o png').removeClass('hidden');
                    self.$el.find('button:submit').addClass('hidden');
                }else{
                    self.$el.find('button:submit').removeClass('hidden');
                }
            }else{
                self.$el.find('button:submit').addClass('hidden');
            }
        },
        changeImage: function(e){
            var self = this;
            self.$el.find('p.text-danger').text('').addClass('hidden');
            self.$el.find('input:file').trigger('click');
        },
        uploadImage: function(e){
            e.preventDefault();
            var self = this,
                form = self.$(e.target);
        
            self.$el.find('button[name="guardar"]').addClass('hidden');
               
            self.ajax = $.ajax(self.model.url() + '/upload_image', {
                 files: $(":file", form.get(0)),
                 data: $(":hidden", form.get(0)).serializeArray(),
                 iframe: true,
                 processData: false
             }).complete(function(data) {
                 self.ajax = null;
                 self.$el.find('button[name="guardar"]').removeClass('hidden');
                 if (data.hasOwnProperty('responseJSON')){
                     var response = data.responseJSON;
                     self.model.set('foto',response.url,{silent: true});
                     self.$el.find('input:text, select, input:password').each(function(){
                         var $this = $(this);
                         self.model.set($this.attr('name'), $this.val(), {silent: true});
                     });
                     self.render();
                 }else{
                     self.$el.find('p.text-danger').text('Ocurrio un problema al intentar subir la imagen, intente nuevamente').removeClass('hidden');
                     self.$el.find('button:submit').addClass('hidden');
                 }
             });
        },
        cancelUpload : function(){
            var self = this;
            
            if (self.ajax !== null){
                self.ajax.abort();
                self.ajax = null;
                self.$el.find('p.text-danger').text('').addClass('hidden');
            }
        },
        onlyNumber : function(e){
            var key = e.which;
            if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || (key >= 37 && key <= 40) || key === 27 || key === 9 || key === 116)){
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
        },
        showValidationError: function(message){
            this.$el.find('p[data-name="message_validation"]').text(message).removeClass('hidden');
        },
        hiddenValidationError: function(){
            this.$el.find('p[data-name="message_validation"]').text('').addClass('hidden');
        }
    });
    
    _.extend(UserAdd, Backbone.Events);
    
    var UserApp = Backbone.View.extend({
        initialize : function (options) {
            this.options = options || {};
            this.show = false;
            this.$el.find('button[name="adduser"]').tooltip();
            this.collection.on('remove', this.showMore, this);
            this.collection.on('add', this.showMore, this);
            this.showMore();
        },
        events : {
            'click button[name= "adduser"]' : 'addUser',
            'keydown input:text[name="find_users"]' : 'stopSearch',
            'keyup input:text[name="find_users"]' : 'startSearch',
            'click button[name="show_more"]' : 'paginate'
        },
        addUser : function(){
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
                self.$el.find('button[name="show_more"]').parent().remove();
            }
        },
        research: function(){
            var target = this.$el.find('input:text[name="find_users"]'),
                self = this;
            self.collection.search({term : decodeURIComponent(target.val())});
        },
        paginate: function(){
            var target = this.$el.find('input:text[name="find_users"]');
            this.collection.paginate({term : decodeURIComponent(target.val())});
        }
    });
    
    var UserView = Backbone.View.extend({
        tagName : 'div',
        className : 'modal fade',
        template : _.template(TemplateView),
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
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
        }
    });
    
    var UserEdit = Backbone.View.extend({
        tagName : 'div',
        className : 'modal fade',
        template : _.template(TemplateEdit),
        attributes : {
            tabindex : "-1",
            role : "dialog",
            'aria-labelledby' : "myModalLabel",
            'aria-hidden' : "true"
        },
        initialize: function(){
            this.model.on('change', this.render, this);
        },
        events: {
            'click button[name="save"]': 'update',
            'keydown input[type="text"][name="cedula"]' : 'onlyNumber',
            'keydown input[type="text"][name="nombre"],input[type="text"][name="apellido"]' : 'onlyCharacter',
            'click button:submit' : 'uploadImage',
            'form submit' : function(e){ e.preventDefault(); },
            'click button[name="change_image"]': 'changeImage',
            'change input:file' : 'validateImage',
            'click button[name="close"],span[data-name="close"]' : 'cancelUpload'
        },
        render: function(){
            var model = _.extend({token: $('meta[name="csrf-token"]').attr('content')},this.model.toJSON());
            this.$el.html(this.template(model));
            this.$el.find('*[data-toggle="tooltip"]').tooltip();
        },
        update: function(){
            var self = this;
            
            this.hiddenValidationError();
            
            self.$el.find('input:text, select, input:password').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
            
            if (!self.model.isValid() && (_.where(self.model.validationError, {name: "password"}).length === 0) && (_.where(self.model.validationError, {name: "rpt_password"}).length === 0)) {
                self.showErrors(self.model.validationError);
            }else{
                self.$el.find('button[name="save"]').prop('disabled',true);
                self.model.save({},{
                    validate: false,
                    success : function(model,xhr){ 
                        self.$el.find('button[name="save"]').prop('disabled',false);
                        if (xhr.ok === true){
                            self.trigger("user:update", xhr);
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
        },
        validateImage: function(e){
            var self = this,
                target = e.target;
                
            if (target.files[0] !== undefined){
                var extension = target.files[0].name.split('.').pop().toLowerCase();
                if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png'){
                    self.$el.find('p.text-danger').text('Solo se permiten imagenes de tipo jpg o png').removeClass('hidden');
                    self.$el.find('button:submit').addClass('hidden');
                }else{
                    self.$el.find('button:submit').removeClass('hidden');
                }
            }else{
                self.$el.find('button:submit').addClass('hidden');
            }
        },
        changeImage: function(e){
            var self = this;
            self.$el.find('p.text-danger').text('').addClass('hidden');
            self.$el.find('input:file').trigger('click');
        },
        uploadImage: function(e){
            e.preventDefault();
            var self = this,
                form = self.$el.find('form');
            self.$el.find('button[name="guardar"]').addClass('hidden');
               
            self.ajax = $.ajax(self.model.url() + '/upload_image', {
                 files: $(":file", form.get(0)),
                 data: $(":hidden", form.get(0)).serializeArray(),
                 iframe: true,
                 processData: false
             }).complete(function(data) {
                 self.ajax = null;
                 self.$el.find('button[name="guardar"]').removeClass('hidden');
                 if (data.hasOwnProperty('responseJSON')){
                     var response = data.responseJSON;
                     self.model.set('foto',response.url,{silent: true});
                     self.$el.find('input:text, select, input:password').each(function(){
                         var $this = $(this);
                         self.model.set($this.attr('name'), $this.val(), {silent: true});
                     });
                     self.render();
                 }else{
                     self.$el.find('p.text-danger').text('Ocurrio un problema al intentar subir la imagen, intente nuevamente').removeClass('hidden');
                     self.$el.find('button:submit').addClass('hidden');
                 }
             });
        },
        cancelUpload : function(){
            var self = this;
            
            if (self.ajax !== null && self.ajax !== undefined){
                self.ajax.abort();
                self.ajax = null;
                self.$el.find('p.text-danger').text('').addClass('hidden');
            }
        },
        onlyNumber : function(e){
            var key = e.which;
            if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || (key >= 37 && key <= 40) || key === 27 || key === 9 || key === 116)){
                e.preventDefault();
            }
        },
        onlyCharacter : function(e){
            var key = e.which;
            if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)){
                e.preventDefault();
            }
        }
    });
    
    _.extend(UserEdit, Backbone.Events);
    
    return {
        list : ListUsers,
        user : User,
        add : UserAdd,
        app : UserApp,
        view : UserView,
        edit: UserEdit
    };
});