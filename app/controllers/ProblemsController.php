<?php


class ProblemsController extends \BaseController{
    
    /**
     * Show all problems
     */
    public function index(){
        
        $userAuth = Auth::user();
            
            $term = Input::get('term');
            $limit = Input::get('limit');
            $page = Input::get('page');
            $off = $limit * $page;
            
            if (Request::ajax()){
                $problems = array();
                $problem = Problem::where('titulo','LIKE', "%{$term}%")->take(30)->skip($off)->orderBy('titulo','ASC')->get();
                $count = Problem::where('titulo','LIKE', "%{$term}%")->count();
                
                foreach ($problem as $value){
                    $problems[] = array(
                        'id' => $value->id,
                        'titulo' => $value->titulo,
                        'resolucion' => $value->resolucion,
                        'deletable' => ($userAuth->rol == 1) ? true : false,
                        'updateable' => ($userAuth->rol == 1) ? true : false
                    );
                }
                                
                return Response::json(array('total' => $count, 'data' => $problems));
            }
            
            
            $problems = array();
            foreach (Problem::take(30)->orderBy('titulo','ASC')->get() as $value){
                $problems[] = array(
                    'id' => $value->id,
                    'titulo' => $value->titulo,
                    'resolucion' => $value->resolucion,
                    'deletable' => ($userAuth->rol == 1) ? true : false,
                    'updateable' => ($userAuth->rol == 1) ? true : false
                );
            }
            return View::make('problem',array('problems' => json_encode($problems), 'count' => Problem::count()));
    }
    
    /**
    * Store a newly created resource in storage.
    *
    * @return Response
    */
    public function store(){
        
        $userAuth = Auth::user();
        
        $titulo = strtolower(Input::get('titulo'));
        $resolucion = Input::get('resolucion');
        
        if (Problem::where('titulo', '=', $titulo)->count() > 0){
            $data = array('ok' => false, 'message' => 'Ya existe un problema registrado con ese mismo titulo');
            return Response::json($data);
        }
        
        $problem = Problem::create(array('titulo' => $titulo, 'resolucion' => $resolucion));
        $problem['ok'] = true;
        $problem['deletable'] = ($userAuth->rol == 1) ? true: false;
        $problem['updateable'] = ($userAuth->rol == 1) ? true: false;
        return Response::json($problem);
    }
    
    /**
    * Update the specified resource in storage.
    *
    * @param  int  $id
    * @return Response
    */
    public function update($id){

        $userAuth = Auth::user();

        $id = Input::get('id');
        $titulo = Input::get('titulo');
        $resolucion = strtolower(Input::get('resolucion'));
        $problem = Problem::find($id);

        if (count ($problem) === 0){ return Response::json('{"ok": false, "message":"El problema no se encuentra"}'); }

        if ($problem::where('titulo', '=', $titulo)->where('id','!=',$id)->count() > 0){
            $data = array('ok' => false, 'message' => 'Ya existe un problema con ese mismo titulo');
            return Response::json($data);
        }

        $problem->titulo = $titulo;
        $problem->resolucion = $resolucion;

        $problem->save();

        $problem['ok'] = true;
        $problem['deletable'] = ($userAuth->rol == 1) ? true: false;
        $problem['updateable'] = ($userAuth->rol == 1) ? true: false;
        return Response::json($problem);
    }
    
    /**
    * Remove a problem
    *
    * @param  int  $id id of a problem
    * @return Response
    */
    public function destroy($id){

        $userAuth = Auth::user();

        if ($userAuth->rol != 1){
            return Response::json(array(
                'error' => 'Accion no permitida'
            ), 403);
        }

        $problem = Problem::find($id);
        if ($problem){
            $problem->delete();
            return Response::json(array(
                'ok' => true
            ), 200);
        }else{
            return Response::json(array(
                'error' => 'Problema no encontrado'
            ), 404);
        }
    }
}
