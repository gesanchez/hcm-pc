<?php

class UserController extends \BaseController {
        
        /**
         * Show all users
         */
        public function index(){
            
            $term = Input::get('term');
            $limit = Input::get('limit');
            $page = Input::get('page');
            $off = $limit * $page;
            
            if (Request::ajax()){
                $users = array();
                $user = DB::select( DB::raw("SELECT id, CONCAT(nombre,' ',apellido) AS full_name, foto, nombre,apellido, cedula, rol FROM usuarios WHERE cedula LIKE '%$term%' OR CONCAT(nombre,' ',apellido) LIKE '%$term%' ORDER BY nombre ASC LIMIT {$limit} OFFSET {$off}") );
                $count = DB::select( DB::raw("SELECT COUNT(id) as count FROM usuarios WHERE cedula LIKE '%$term%' OR CONCAT(nombre,' ',apellido) LIKE '%$term%'") );
                foreach ($user as $value){
                    $users[] = array(
                        'id' => $value->id,
                        'rol' => $value->rol,
                        'nombre' => ucwords($value->nombre),
                        'apellido' => ucwords($value->apellido),
                        'foto' => $value->foto,
                        'cedula' => $value->cedula,
                        'deletable' => true,
                        'updateable' => true
                    );
                }
                                
                return Response::json(array('total' => $count[0]->count, 'data' => $users));
            }
            
            
            $users = array();
            foreach (User::take(30)->orderBy('nombre','ASC')->get() as $value){
                $users[] = array(
                    'id' => $value->id,
                    'rol' => $value->rol,
                    'nombre' => ucwords($value->nombre),
                    'apellido' => ucwords($value->apellido),
                    'foto' => $value->foto,
                    'cedula' => $value->cedula,
                    'deletable' => true,
                    'updateable' => true
                );
            }
            return View::make('users',array('users' => json_encode($users), 'count' => User::count()));
        }
        

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(){
            
            $cedula = Input::get('cedula');
            $nombre = Input::get('nombre');
            $apellido = Input::get('apellido');
            $rol = Input::get('rol');
            $password = Input::get('password');
            $foto = Input::get('foto');
            
            
            if (User::where('cedula', '=', $cedula)->count() > 0){
                $data = array('ok' => false, 'message' => 'Ya existe un usuario con ese mismo numero de cedula');
                return Response::json($data);
            }
            
            $user = User::create(array('cedula' => $cedula, 'nombre' => ucwords($nombre), 'apellido' => ucwords($apellido), 'rol' => $rol, 'foto' => $foto, 'password' => Hash::make($password)));
            $user['ok'] = true;
            $user['deletable'] = true;
            $user['updateable'] = true;
            return Response::json($user);
		
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove a user
	 *
	 * @param  int  $id id of a user
	 * @return Response
	 */
	public function destroy($id){
                
            $user = User::find($id);
            //print_r($user);
            if ($user){
                $user->delete();
                return Response::json(array(
                    'ok' => true
                ), 200);
            }else{
                return Response::json(array(
                    'error' => 'Usuario no encontrado'
                ), 404);
            }
	}
        
        /**
         * Upload profile image and return it url
         * 
         * @return json json with the url file
         * @example {"url":"file.png"}
         */
        public function upload_image(){
            
            $file = Input::file('file');
            $filename = uniqid() . '.' . last(explode('.',$file->getClientOriginalName()));
            
            if (!is_dir(public_path().'/uploads')){ mkdir(public_path().'/uploads', 0777); }
            
            $uploadSuccess = $file->move(public_path().'/uploads', $filename);
            
            if ($uploadSuccess){
                return '<textarea data-type="application/json">{"ok": true, "url": "'.asset('uploads/'.$filename).'"}</textarea>';
            }
            
        }

}
