<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>HCM</title>
        <link rel="stylesheet" href="{{ asset('stylesheet/style.css') }}"/>
        <link rel="stylesheet" href="{{ asset('stylesheet/bootstrap.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('stylesheet/bootstrap-theme.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('stylesheet/font-awesome.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('stylesheet/chosen.min.css') }}"/>
    </head>
    <body>
        <div class="wrap" id="wrap-app">
            <div class="navbar-header">
                <a class="navbar-brand" href="{{ route('root') }}">
                    <b style="color: #FFFFFF">HCM</b>
                </a>
            </div>
            <nav class="navbar-collapse collapse navbar-default">
                <ul class="nav navbar-nav navbar-righ pull-right">
                    @if (Auth::user()->rol == 1)
                    <li>
                        <a href="{{ route('users') }}">Usuarios</a>
                    </li>
                    @endif
                    
                    @if (Auth::user()->rol == 2)
                    <li>
                        <a href="{{ route('gincidentes') }}">Gesti&oacute;n de incidentes</a>
                    </li>
                    @endif
                    
                    @if (Auth::user()->rol == 1 || Auth::user()->rol == 2)
                    <li>
                        <a href="{{ route('inventory') }}">Inventario</a>
                    </li>
                    @endif
                    
                    @if (Auth::user()->rol == 1 || Auth::user()->rol == 2)
                    <li>
                        <a href="{{ route('problems') }}">Problemas t&iacute;picos</a>
                    </li>
                    @endif
                    
                    @if (Auth::user()->rol == 4)
                    <li>
                        <a href="#">Reportar un problema</a>
                    </li>
                    @endif
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="icon-bar glyphicon glyphicon-user"></i>
                            {{ Str::title(Auth::user()->nombre) }} {{ Str::title(Auth::user()->apellido) }}
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="{{ route('profile_view') }}">Ver perfil</a>
                            </li>
                            <li>
                                <a href="{{ route('logout') }}">Cerrar sesi&oacute;n</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div class="container" id="container_app">
                @yield('content')
            </div>
            <div class="footer">
                hcm &COPY; {{ date('Y') }} |  Meriveth Mogollon
            </div>
        </div>
        <script type="text/javascript" src="{{ asset('javascript/require.js') }}"></script>
        <script type="text/javascript">
            define('conf',[],function(){
                return{
                    asset : '{{asset('javascript')}}',
                    templates: '{{asset('templates')}}'
                };
            });
        </script>
        <script type="text/javascript" src="{{ asset('javascript/main.js') }}"></script>
        @yield('js')
    </body>
</html>
