<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePcsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pcs', function(Blueprint $table)
		{
                    $table->increments('id');
                    $table->string('serial',100);
                    $table->integer('disco');
                    $table->integer('ram');
                    $table->string('proc_velocidad', 10);
                    $table->string('proc_modelo', 20);
                    $table->string('proc_marca', 50);
                    $table->string('mon_marca', 50);
                    $table->string('mon_pulgadas', 50);
                    $table->string('teclado', 50);
                    $table->string('mouse', 50);
                    $table->timestamps();
                    
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
//		Schema::table('pcs', function(Blueprint $table)
//		{
//			//
//		});
            Schema::drop('pcs');
	}

}
