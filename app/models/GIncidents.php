<?php


class GIncidents extends Eloquent{
    /**
    * The database table used by the model.
    *
    * @var string
    */
    protected $table = 'gestion_incidentes';
    
    protected $fillable = ['usuario_id', 'fecha', 'descripcion', 'tecnico_id', 'estatus', 'informe'];
    
    public function user(){
        
        return $this->belongsTo('User', 'usuario_id');
    }
    
    public function tecnico(){
        
        return $this->belongsTo('User', 'tecnico_id');
    }
}
