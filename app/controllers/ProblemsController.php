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
                $users = array();
                $user = Problem::where('titulo','LIKE', $term)->take(30)->skip($off)->orderBy('titulo','ASC')->get();
                $count = Problem::where('titulo','LIKE', $term)->count();
                foreach ($user as $value){
                    $users[] = array(
                        'id' => $value->id,
                        'titulo' => $value->titulo,
                        'resolucion' => $value->resolucion,
                        'deletable' => ($userAuth->rol == 1) ? true : false,
                        'updateable' => ($userAuth->rol == 1) ? true : false
                    );
                }
                                
                return Response::json(array('total' => $count[0]->count, 'data' => $users));
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
}
