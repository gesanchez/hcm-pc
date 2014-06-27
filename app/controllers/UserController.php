<?php

class UserController extends \BaseController {
        
        /**
         * Show all users
         */
        public function index(){
            
            $users = array();
            foreach (User::take(30)->orderBy('nombre','DESC')->get() as $value){
                $users[] = array(
                    'id' => $value->id,
                    'nombre' => $value->nombre,
                    'apellido' => $value->apellido,
                    'foto' => $value->foto,
                    'cedula' => $value->cedula,
                    'deletable' => true,
                    'updateable' => true
                );
            }
            return View::make('users',array('users' => json_encode($users)));
        }
        

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		
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
