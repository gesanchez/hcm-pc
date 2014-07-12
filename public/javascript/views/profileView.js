define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/profile/profile.html',
    'transport'
],function($, _, Backbone, Template){
    
    var User = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        template : _.template(Template),
        attributes : {
            'style' : 'position: relative;margin-bottom: 30px'
        },
        initialize: function(options){
            this.options = options || {};
            this.render();
        },
        render: function(){
            var model = _.extend({token: $('meta[name="csrf-token"]').attr('content')},this.model.toJSON());
            this.$el.html( this.template(model));
            this.$el.find('*[data-toggle="tooltip"]').tooltip();
        },
        events : {
            'keydown input[type="text"][name="cedula"]' : 'onlyNumber',
            'keydown input[type="text"][name="nombre"],input[type="text"][name="apellido"]' : 'onlyCharacter',
            'click button[name="change_image"]': 'changeImage',
            'change input:file' : 'validateImage',
            'click button:submit': 'uploadImage',
            'click button[name="save_profile"]' : 'save',
            'submit form' : function(e){ e.preventDefault(); }
        },
        save : function(e){
            var self = this;
            
            this.hiddenValidationError();
            this.hideErrors();
            
            self.$el.find('input:text, select, input:password').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
                        
            if (!self.model.isValid() || !self.validPassword()) {
                self.showErrors(self.model.validationError);
            }else{
                self.$el.find('button[name="save_profile"]').prop('disabled',true);
                self.model.save(null,{
                    validate: false,
                    success : function(model,xhr){ 
                        self.$el.find('p[data-name="message_ok"]').text('Perfil guardado con exito').removeClass('hidden');
                        self.$el.find('input:password').val('');
                        setTimeout(function(){
                            self.$el.find('button[name="save_profile"]').prop('disabled',false);
                            self.$el.find('p[data-name="message_ok"]').text('').addClass('hidden');
                            self.model.set({'password' : '', 'rpt_password':''});
                        },5000);
                    },
                    error : function(){
                        self.$el.find('button[name="save_profile"]').prop('disabled',false);
                        self.showValidationError('Ocurrio un error al intentar guardar, intente nuevamente');
                    }
                });
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
        changeImage: function(e){
            var self = this;
            self.$el.find('p.text-danger').text('').addClass('hidden');
            self.$el.find('input:file').trigger('click');
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
            
            if (self.ajax !== null){
                self.ajax.abort();
                self.ajax = null;
                self.$el.find('p.text-danger').text('').addClass('hidden');
            }
        },
        hiddenValidationError: function(){
            this.$el.find('p[data-name="message_validation"],p[data-name="message_ok"]').text('').addClass('hidden');
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
        validPassword: function(){
            var self = this,
                errors = [];
            
            if(self.model.get('password') && self.model.get('password').length < 6){
                errors.push({name: 'password', message: 'La clave debe contener al menos 6 caracteres'});
            }
            
            if (self.model.get('rpt_password') && self.model.get('password') && self.model.get('password') !== self.model.get('rpt_password')){
                errors.push({name: 'password', message: 'Las claves no coinciden'});
            }
            
            if (errors.length > 0){
                self.showErrors(errors);
                return false;
            }
            
            return true;
        }
    });
    
    return User;
});