<?php

class GIncidentController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(){
            $userAuth = Auth::user();
            
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
                        'deletable' => ($userAuth->rol == 1) ? true : false,
                        'updateable' => ($userAuth->rol == 1) ? true : false
                    );
                }
                                
                return Response::json(array('total' => $count[0]->count, 'data' => $users));
            }
            
            
            $incidents = array();
            foreach (GIncidents::take(30)->orderBy('fecha','ASC')->get() as $value){
                $incidents[] = array(
                    'id' => $value->id,
                    'fecha' => $value->fecha,
                    'descripcion' => $value->descripcion,
                    'estatus' => $value->estatus,
                    'informe' => $value->informe,
                    'deletable' => true,
                    'updateable' => true
                );
            }
            
            return View::make('gincidents',array('incidents' => json_encode($incidents), 'count' => GIncidents::count()));
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
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
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
