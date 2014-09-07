<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GincidenteTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up(){
            Schema::create('gestion_incidentes', function(Blueprint $table){
                $table->increments('id');
                $table->integer('usuario_id');
                $table->timestamp('fecha',100);
                $table->text('descripcion')->nullable();
                $table->integer('tecnico_id')->nullable();
                $table->tinyInteger('estatus'); // 1- Pendiente | 2 - En Proceso | 3 - Listo
                $table->text('informe')->nullable();
                $table->timestamps();
            });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down(){
            
		Schema::drop('gestion_incidentes');
	}

}
