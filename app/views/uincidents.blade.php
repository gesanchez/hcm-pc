@extends('app')

@section('content')
<div id="tincidents_app">
    <div class="page-header">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <h1>Incidentes registrados</h1>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="clearfix"></div>
    <div class='row'>
        <div class='col-xs-12 col-sm-6 col-md-3 col-lg-3' style='margin-bottom: 10px'>
            <div class="input-group">
                <div class="input-group-addon">
                    <i class="fa fa-calendar"></i>
                </div>
                <input class="form-control" type="text" placeholder="Fecha" name="date" autocomplete="off"/>
            </div>
        </div>
        
        <div class='col-xs-12 col-sm-6 col-md-3 col-lg-3' style='margin-bottom: 10px'>
            <select autocomplete='off' class='form-control' name='estatus'>
                <option value='' selected>Estatus</option>
                <option value='1'>Pendiente</option>
                <option value='2'>En proceso</option>
                <option value='3'>Revisado</option>
            </select>
        </div>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6' style='margin-bottom: 10px'>
            <button class='btn btn-primary pull-right' type='button' name='search'>Search</button>
            <button class='btn btn-info pull-right' style='margin-left: 2px;margin-right: 2px' type='button' name='add'>Reportar incidente</button>
        </div>
    </div>
    <div id="tincidents_list" style="margin-bottom: 50px;margin-top: 30px"></div>
</div>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/uincidents'], function(app){
       app._init('tincidents_app','tincidents_list' ,'{{ $incidents }}','{{ $count }}'); 
    });
</script>
@stop
