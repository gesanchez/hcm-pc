@extends('app')

@section('content')
    <p>This is my body content.{{ $users }}</p>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/users'], function(app){
       app._init('container_app'); 
    });
</script>
@stop
