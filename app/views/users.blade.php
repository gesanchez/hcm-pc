@extends('app')

@section('content')
<div id="user_app">
    <div class="page-header">
      <h1>Usuarios</h1>
    </div>
    <div style='margin-bottom: 10px'>
        <button class="btn pull-right btn-info" name="adduser">Agregar</button>
    </div>
    <div style="clear: both"></div>
    <div id="user_app_list" style="margin-bottom: 50px"></div>
</div>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/users'], function(app){
       app._init('user_app','user_app_list', '{{ $users }}'); 
    });
</script>
@stop
