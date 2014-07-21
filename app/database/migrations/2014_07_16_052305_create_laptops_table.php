<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaptopsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('laptops', function(Blueprint $table)
		{
                    $table->increments('id');
                    $table->string('serial',100);
                    $table->float('pulgadas');
                    $table->integer('disco');
                    $table->integer('ram');
                    $table->string('marca',50);
                    $table->string('proc_velocidad', 10);
                    $table->string('proc_modelo', 20);
                    $table->string('proc_marca', 50);
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
//		Schema::table('laptops', function(Blueprint $table)
//		{
//			//
//		});
            Schema::drop('laptops');
	}

}
