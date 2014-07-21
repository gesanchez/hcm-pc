<?php


class Problem extends Eloquent{
    
    /**
    * The database table used by the model.
    *
    * @var string
    */
    protected $table = 'problemas';
    
    protected $fillable = ['titulo', 'resolucion'];
}
