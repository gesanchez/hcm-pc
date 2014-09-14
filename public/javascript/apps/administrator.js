define([
    'jquery',
    'backbone',
    'views/administratorView',
    'models/gincidentsModel',
    'highcharts'
], function ($, Backbone, View, Model) {
    'use strict';
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(data, incidents){
        
        var json = $.parseJSON($(data).text()),
            incidents = $.parseJSON($(incidents).text());
        
        $.each(json, function(){
            $(this.id).highcharts(this);
        });
        
        var CollectionAll = new Model.Collection(incidents.all),
            CollectionChecked = new Model.Collection(incidents.checked),
            IncidentsAllView = new View.Collection({collection: CollectionAll, el: '#incidentes-all'}),
            IncidentesCheckedView = new View.Collection({collection: CollectionChecked, el: '#incidentes-checked'});
    
        IncidentsAllView.render();
        IncidentesCheckedView.render();
            
    };
    
    return {
        "_init" : init
    };
});