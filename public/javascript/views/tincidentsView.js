define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/tincidents/tincident.html',
    'confirm',
    'jquery-bridget',
    'masonry',
    'text!templates/tincidents/informe.html',
    'text!templates/gincidents/viewIncident.html',
    'datetimepicker'
],function($, _, Backbone, App, Template,confirm,Bridget,Masonry, Informe, View){
    'use strict';
    
    Bridget('masonry', Masonry );
    
    var ItemList = Backbone.View.extend({
        initialize : function(options){
            var self = this;
            self.options = options || {};
            self.collection.on('add', self.addItem, self);
            self.collection.on('destroy', self.removeItem, self);
            self.collection.on('change:tecnico', function(){ self.$el.masonry('layout'); }, self);
            self.collection.on('remove', function(){ self.$el.masonry('layout'); }, self);
            
            
            self.$el.masonry({
                itemSelector: '.col-xs-12',
                columnWidth: '.col-xs-12'
            });
        },
        addItem : function(item){
            var problem = new Item({ model: item, collection: this.collection});
            this.$el.append(problem.el);
            this.$el.masonry('layout');
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
            'click a[data-name="checked"]' : 'checked',
            'click a[data-name="process"]' : 'process'
        },
        showInformation : function(e){
            e.preventDefault();
            App.router.navigate('view/' + this.model.id, {trigger: true});
        },
        checked : function(e){
            e.preventDefault();
            App.router.navigate('informe/' + this.model.id, {trigger: true});
        },
        process: function(e){
            e.preventDefault();
            this.model.set('estatus',2);
            this.model.save(null);
        },
        removeElement : function(e){
            this.remove();
        }
    });
    

    
    var ItemApp = Backbone.View.extend({
        initialize : function (options) {
            this.options = options || {};
            this.show = false;
            this.collection.on('remove', this.showMore, this);
            this.collection.on('add', this.showMore, this);
            
            this.$el.find('input:text[name="date"]').datetimepicker({pickTime: false,language:'es'});
            
            this.initial_state();
        },
        events : {
            'click button[name="search"]' : 'search',
            'click button[name="show_more"]' : 'paginate'
        },
        search: function(){
            var self = this,
                parameters = {
                    usuarios : decodeURIComponent(self.$el.find('input:text[name="usuarios"]').val()),
                    fecha: self.$el.find('input:text[name="date"]').val(),
                    estatus: self.$el.find('select[name="estatus"]').val()
                };
            
            
            self.collection.search(parameters, function(){
                if (self.collection.length === 0){
                    self.$el.find('p.lead').parent().remove();
                    self.$el.find('div[data-name="nofound"]').remove();
                    self.$el.append('<div style="text-align: center;margin-bottom: 20px" data-name="nofound"><h3>No se encontraron registros</h3></div>');
                }else{
                    self.$el.find('div[data-name="nofound"]').remove();
                }
            });
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
                self.$el.append('<div style="text-align: center;margin-bottom: 20px"><p class="lead">No existen incidentes registrados</p></div>');
            }else{
                
                self.$el.find('p.lead').parent().remove();
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
                    self.$el.append('<div style="text-align: center;margin-bottom: 20px"><p class="lead">No existe un item creado aun</p><button class="btn" type="button" name="create_item">Crear</button></div>');
                }
            });
        },
        paginate: function(){
            var target = this.$el.find('input:text[name="find_inventary"]');
            this.collection.paginate({term : decodeURIComponent(target.val())});
        }
    });
    

//    _.extend(ProblemAdd, Backbone.Events);
    
    
    var viewIncident = Backbone.View.extend({
       tagName: 'div',
       className : 'modal fade',
       template: _.template(View),
       attributes : {
            tabindex : "-1",
            role : "dialog",
            'aria-labelledby' : "myModalLabel",
            'aria-hidden' : "true"
        },
        initialize: function(){
            this.render();            
            this.$el.on('hidden.bs.modal', function (e) {
                App.router.navigate('', {trigger: true});
            });
            this.model.on('change',this.render, this);
        },
        addItem : function(item){
            var user = new userView({ model: item });
            this.content.append(user.el);
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    
    var Informe = Backbone.View.extend({
        tagName : 'div',
        className: 'modal fade',
        template: _.template(Informe),
        attributes : {
            tabindex : "-1",
            role : "dialog",
            'aria-labelledby' : "myModalLabel",
            'aria-hidden' : "true"
        },
        events:{
            'click button[name="save"]': 'save'
        },
        initialize: function(){
            this.render();            
            this.$el.on('hidden.bs.modal', function (e) {
                App.router.navigate('', {trigger: true});
            });
            this.model.on('change', this.render, this);
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        save: function(){
            var informe = this.$el.find('textarea').val();
            this.model.set('informe', informe);
        }
    });
    
    
    return {
        List : ItemList,
        Problem : Item,
        App : ItemApp,
        View: viewIncident,
        Informe: Informe
    };
});