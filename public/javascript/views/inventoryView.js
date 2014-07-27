define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/inventory/inventory.html',
    'text!templates/inventory/type.html',
    'text!templates/inventory/addLaptop.html',
    'text!templates/inventory/addPc.html',
    'text!templates/inventory/viewLaptop.html',
    'text!templates/inventory/viewPc.html',
    'confirm',
    'chosen'
],function($, _, Backbone, App, Template, TemplateType, TemplateAddLaptop, TemplateAddPc, TemplateViewLaptop, TemplateViewPc){
    'use strict';
    
    var ItemList = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        initialize : function(options){
            var self = this;
            self.options = options || {};
            self.collection.on('add', self.addItem, self);
            self.collection.on('destroy', self.removeItem, self);
        },
        addItem : function(item){
            var problem = new Item({ model: item, view : this.options.view, edit: this.options.edit });
            this.$el.append(problem.el);
        },
        removeItem: function(element){
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
    
    _.extend(ItemList, Backbone.Events);
    
    var Item = Backbone.View.extend({
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
            
            return this;
        },
        events : {
            'click a[data-name="view"]' : 'showInformation',
            'click a[data-name="delete"]' : 'destroyElement',
            'click a[data-name="edit"]' : 'editElement'
        },
        showInformation : function(e){
            e.preventDefault();
            App.router.navigate('view/' + this.model.id, {trigger: true});
        },
        destroyElement : function(e){
            e.preventDefault();
            var target = $(e.target),
                self = this,
                parent = target.parent().addClass('hidden');
                $.confirm({
                    text: "Desea usted eliminar este Item?",
                    confirmButton: "Si",
                    cancelButton: "No",
                    confirm: function(button) {
                        self.model.destroy({
                            wait: true,
                            error: function(){
                                parent.removeClass('hidden');
                            }
                        });
                    },
                    cancel: function(button) {
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
            this.remove();
        }
    });
    
    var ItemApp = Backbone.View.extend({
        initialize : function (options) {
            this.options = options || {};
            this.show = false;
            this.$el.find('button[name="additem"]').tooltip();
            this.collection.on('remove', this.showMore, this);
            this.collection.on('add', this.showMore, this);
        },
        events : {
            'click button[name= "additem"],button[name="create_item"]' : 'addItem',
            'keydown input:text[name="find_inventary"]' : 'stopSearch',
            'keyup input:text[name="find_inventary"]' : 'startSearch',
            'click button[name="show_more"]' : 'paginate'
        },
        addItem : function(){
            this.$el.find('button[name="create_item"]').parent().remove();
            App.router.navigate("addItem",{trigger: true});
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
        showMore: function(e){
            var self = this;
            if (self.collection.total - self.collection.length > 0){
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
                self.$el.append('<div style="text-align: center;margin-bottom: 20px"><p class="lead">No exite un item creado aun</p><button class="btn" type="button" name="create_item">Crear</button></div>');
            }else{
                
                self.$el.find('button[name="create_item"]').parent().remove();
            }
        },
        no_result: function(){
            var self = this;
            if (self.collection.length === 0){
                self.$el.append('<div style="text-align: center;margin-bottom: 20px" data-name="nofound"><h3>No se encontraron registros</h3></div>');
            }else{
                
                self.$el.find('div[data-name="nofound"]').remove();
            }
        },
        research: function(){
            var target = this.$el.find('input:text[name="find_inventary"]'),
                self = this;
            self.collection.search({term : decodeURIComponent(target.val())}, function(){
                if (target.val() === '' && self.collection.length === 0){
                    self.$el.append('<div style="text-align: center;margin-bottom: 20px"><p class="lead">No exite un item creado aun</p><button class="btn" type="button" name="create_item">Crear</button></div>');
                }
            });
        },
        paginate: function(){
            var target = this.$el.find('input:text[name="find_inventary"]');
            this.collection.paginate({term : decodeURIComponent(target.val())});
        }
    });
    
    var inventoryType = Backbone.View.extend({
        tagName: 'div',
        className: 'row',
        template: _.template(TemplateType),
        initialize: function(options){
            this.options = options || {};
            this.render();
        },
        events: {
            'mouseover i.fa' : 'hover',
            'mouseout i.fa' : 'out',
            'click i.fa' : 'select',
            'click button' : 'back'
        },
        render : function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        hover: function(e){
            var self = this,
                target = $(e.target);
        
            target.css('color','#21b384');
        },
        out: function(e){
            var self = this,
                target = $(e.target);
        
            target.css('color','');
        },
        select: function(e){
            var target = $(e.target);

            if (target.data('type') === 1){
                
                App.router.navigate('addLaptop',{trigger: true});
                
            }else if (target.data('type') === 2){
                
                App.router.navigate('addPc',{trigger: true});
            }
        },
        back: function(e){
            App.router.navigate('',{trigger: true});
        }
    });
    
    var LaptopAdd = Backbone.View.extend({
       tagName:'div',
       className: 'row',
       template: _.template(TemplateAddLaptop),
       initialize: function(options){
           this.options = options || {};
           this.render();
           this.$el.find('select[name="user_asigned"]').chosen();
       },
       render: function(){
           this.$el.html(this.template({users : this.options.users}));
           return this;
       },
       events: {
            'click button[name="cancel"]' : 'cancel',
            'submit form' : function(e){ e.preventDefault(); },
            'keydown input:text[name="ram"],input:text[name="disco"]' : 'onlyNumber',
            'click button[name="save"]' : 'save',
       },
       cancel : function(){
           App.router.navigate('addItem',{trigger: true});
       },
       save: function(){
            var self = this;
            
            self.hiddenValidationError();
            self.hideErrors();
            
            self.$el.find('input:text').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
            
            self.model.set('user_asigned',this.$el.find('select[name="user_asigned"]').val());
            
            if (!self.model.isValid()) {
                self.showErrors(self.model.validationError);
            }else{
                self.$el.find('button[name="save"]').prop('disabled',true);
                self.model.save(null,{
                    success : function(model,xhr){ 
                        self.$el.find('button[name="save"]').prop('disabled',false);
                        if (xhr.ok === true){
                            self.trigger("laptop:save", xhr);
                            App.router.navigate('',{trigger: true});
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
        onlyNumber : function(e){
            var key = e.which;
            if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || (key >= 37 && key <= 40) || key === 27 || key === 9 || key === 116)){
                e.preventDefault();
            }
        }
    });
    
    _.extend(LaptopAdd, Backbone.Events);
    
    var PcAdd = Backbone.View.extend({
       tagName:'div',
       className: 'row',
       template: _.template(TemplateAddPc),
       initialize: function(options){
            this.options = options || {};
            this.render();
            this.$el.find('select[name="user_asigned"]').chosen();
       },
       render: function(){
           this.$el.html(this.template({users : this.options.users}));
           return this;
       },
       events: {
           'click button[name="cancel"]' : 'cancel',
           'click button[name="save"]' : 'save',
           'submit form' : function(e){ e.preventDefault(); },
           'keydown input:text[name="ram"],input:text[name="disco"]' : 'onlyNumber'
       },
       save: function(){
            var self = this;
            
            self.hiddenValidationError();
            self.hideErrors();
            
            self.$el.find('input:text').each(function(){
                var $this = $(this);
                self.model.set($this.attr('name'), $this.val());
            });
            
            self.model.set('user_asigned',this.$el.find('select[name="user_asigned"]').val());
            
            if (!self.model.isValid()) {
                self.showErrors(self.model.validationError);
            }else{
                self.$el.find('button[name="save"]').prop('disabled',true);
                self.model.save(null,{
                    success : function(model,xhr){ 
                        self.$el.find('button[name="save"]').prop('disabled',false);
                        if (xhr.ok === true){
                            self.trigger("pc:save", xhr);
                            App.router.navigate('',{trigger: true});
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
       cancel : function(){
           App.router.navigate('addItem',{trigger: true});
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
        onlyNumber : function(e){
            var key = e.which;
            if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || (key >= 37 && key <= 40) || key === 27 || key === 9 || key === 116)){
                e.preventDefault();
            }
        }
    });
    
    _.extend(PcAdd, Backbone.Events);
    
    var viewLaptop = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        template : _.template(TemplateViewLaptop),
        initialize : function(options){
            this.options = options || {};
            this.render();
        },
        render : function(){
            this.$el.html(this.template(this.model.attributes));
        },
        events : {
            'click button[name="back"]' : function(){ App.router.navigate('',{trigger: true}); }
        }
    });
    
    var viewPc = Backbone.View.extend({
        tagName : 'div',
        className : 'row',
        template : _.template(TemplateViewPc),
        initialize : function(options){
            this.options = options || {};
            this.render();
        },
        render : function(){
            this.$el.html(this.template(this.model.attributes));
        },
        events : {
            'click button[name="back"]' : function(){ App.router.navigate('',{trigger: true}); }
        }
    });
    
    return {
        List : ItemList,
        Type : inventoryType,
        Problem : Item,
        App : ItemApp,
        LaptopAdd : LaptopAdd,
        PcAdd: PcAdd,
        LaptopView: viewLaptop,
        PcView: viewPc
    };
});