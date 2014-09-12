define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/gincidents/gincident.html',
    'confirm',
    'jquery-bridget',
    'masonry'
],function($, _, Backbone, App, Template,confirm,Bridget,Masonry){
    'use strict';
    
    Bridget('masonry', Masonry );
    
    var ItemList = Backbone.View.extend({
        initialize : function(options){
            var self = this;
            self.options = options || {};
            self.collection.on('add', self.addItem, self);
            self.collection.on('destroy', self.removeItem, self);
            self.collection.on('change:tecnico', function(){ self.$el.masonry('reload'); }, self)
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

            self.$el.masonry({
                itemSelector: '.col-xs-12',
                columnWidth: '.col-xs-12'
            });
            
            
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
            this.$el.find('span.glyphicon-cog, .circlephoto[data-toggle="tooltip"], i.fa-user[data-toggle="tooltip"]').tooltip();
            
            return this;
        },
        events : {
            'click a[data-name="view"]' : 'showInformation',
            'click a[data-name="reject"]' : 'reject',
            'click a[data-name="asign"]' : 'asignResponsible'
        },
        showInformation : function(e){
            e.preventDefault();
            App.router.navigate('view/' + this.model.id, {trigger: true});
        },
        reject : function(e){
            e.preventDefault();
            var target = $(e.target),
                self = this,
                parent = target.parent().addClass('hidden');
                $.confirm({
                    text: "Desea usted rechazar este incidente?",
                    confirmButton: "Si",
                    cancelButton: "No",
                    confirm: function(button) {
                        self.model.set('estatus',0);
                        self.model.save(null,{
                            wait: true,
                            success: function(xhr){
                                if (xhr.ok === true){
                                    self.render();
                                }else if (xhr.ok === false){
                                    alert(xhr.message);
                                }
                                
                            },
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
        asign: function(e){
            e.preventDefault();
            var self = this;
            self.model.set('status',0);
            self.save(null,{
                success: function(){
                    self.render();
                }
            });
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
    
    
    return {
        List : ItemList,
        Problem : Item,
        App : ItemApp
    };
});