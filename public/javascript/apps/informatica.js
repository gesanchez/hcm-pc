define([
    'jquery',
    'highcharts'
], function ($) {
    'use strict';
    /**
     * 
     * @param {string} id of main container
     * @param {json} with inital data of users
     */
    var init = function(data){
        
        var json = $.parseJSON($(data).text());
        
        $.each(json, function(){
            $(this.id).highcharts(this);
        });
    };
    
    return {
        "_init" : init
    };
});