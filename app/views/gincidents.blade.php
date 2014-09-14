@extends('app')

@section('content')
<div id="gincidents_app">
    <div class="page-header">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <h1>Gestion de incidentes</h1>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="clearfix"></div>
    <div class='row'>
        <div class='col-xs-12 col-sm-6 col-md-3 col-lg-3' style='margin-bottom: 10px'>
            <div class="input-group">
                <div class="input-group-addon">
                    <i class="glyphicon glyphicon-search"></i>
                </div>
                <input class="form-control" type="text" placeholder="Buscar por usuario" name="usuarios" autocomplete="off"/>
            </div>
        </div>
        <div class='col-xs-12 col-sm-6 col-md-3 col-lg-3' style='margin-bottom: 10px'>
            <div class="input-group">
                <div class="input-group-addon">
                    <i class="glyphicon glyphicon-search"></i>
                </div>
                <input class="form-control" type="text" placeholder="Buscar por tecnicos" name="tecnicos" autocomplete="off"/>
            </div>
        </div>
        <div class='col-xs-12 col-sm-6 col-md-3 col-lg-3' style='margin-bottom: 10px'>
            <div class="input-group">
                <div class="input-group-addon">
                    <i class="fa fa-calendar"></i>
                </div>
                <input class="form-control" type="text" placeholder="Fecha" name="date" autocomplete="off"/>
            </div>
        </div>
        
        <div class='col-xs-12 col-sm-6 col-md-2 col-lg-2' style='margin-bottom: 10px'>
            <select autocomplete='off' class='form-control' name='estatus'>
                <option value='' selected>Estatus</option>
                <option value='4'>Rechazados</option>
                <option value='1'>Pendiente</option>
                <option value='2'>En proceso</option>
                <option value='3'>Revisado</option>
            </select>
        </div>
        <div class='col-xs-12 col-sm-6 col-md-1 col-lg-1' style='margin-bottom: 10px'>
            <button class='btn btn-primary' type='button' name='search'>Search</button>
        </div>
    </div>
    <div id="gincidents_list" style="margin-bottom: 50px;margin-top: 30px"></div>
</div>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/gincidents'], function(app){
       app._init('gincidents_app','gincidents_list' ,'{{ $incidents }}','{{ $count }}'); 
    });
</script>
@stop
