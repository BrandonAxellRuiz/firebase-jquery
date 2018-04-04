// firebase url of your account 
const crud = new Firebase('https://backhome-examples.firebaseio.com/crud_car_examples/');



// snapshot when add new car
crud.on("child_added", function(snap) {
	
	$('#tabla').append(carga(snap.key(), snap.val()));

});


// function load data
function carga() {
	
	var datos={};

    crud.orderByChild("name_car").on('value',function(data){
    	
    	datos = data.val();
    	var html = '';
          
        $.each(datos, function(id,values){

        	
				html += '<thead class="'+id+'">';
			    html += '<tr>';
			    html += '<th>Estatus</th>';
			    html += '<th>Auto</th>';
			    html += '<th>Descripcion</th>';
			    html += '<th>Hora activo</th>';
			    html += '<th>Hora inactivo</th>';
			    html += '<th>Cambiar estatus</th>';
			    html += '<th>Editar</th>';
			    html += '<th>Eliminar</th>';
			    html += '</tr>';
			    html += '</thead>';
			    
			    html += '<tbody class="'+id+'">';
			    html += '<tr>';

				if(values.status == 1){

					status = '<span>Activo</span>';
					btn_status = '<a onclick="s_car('+"'"+id+"'"+',2)" id="btn_'+id+'" style="cursor:pointer !important;"><i class="material-icons">block</i><br>Bloquear</a>';

				}else if(values.status == 2){

					status = '<span>Desactivado</span>';
					btn_status = '<a onclick="s_car('+"'"+id+"'"+',1)" id="btn_'+id+'" style="cursor:pointer !important;"><i class="material-icons">check_circle</i><br>Desbloquear</a>';

				}

			    html += '<td>'+status+'</td>';
			    html += '<td>'+values.name_car+'</td>';
			    html += '<td>'+values.description_car+'</td>';
			    html += '<td>'+values.time_active+'</td>';
			    html += '<td>'+values.time_inactive+'</td>';
			    html += '<td>'+btn_status+'</td>';
			    html += '<td><a onclick="rd_car('+"'"+id+"'"+')" id="btn_'+id+'" data-toggle="modal" data-target="#myModal_n" style="cursor:pointer !important;"><i class="material-icons">create</i><br>Editar</a></td>';
			    html += '<td><a onclick="d_car('+"'"+id+"'"+')" id="btn_'+id+'" style="cursor:pointer !important;"><i class="material-icons">delete</i><br>Eliminar</a></td>';
			    html += '</tr>';
			    html += '</tbody>';

        });
        $("#tabla").html(html);
    });

}


// snap when changes on database
crud.on("child_changed", function(snap) {
  var changedPost = snap.val();
  $.toast({
        heading: 'Modificado correctamente',
        showHideTransition: 'slide',
        icon: 'success'
    });
});


//function for post data to dabase of new car 
function n_car(){

    if($('#name_car').val()!= '' && $('#description_car').val()!= ''&& $('#time_inactive').val()!= '' && $('#time_active').val()!= ''){
    	
    	$("#btn_car").attr("disabled","disabled");
    	$("#btn_car").removeAttr("onclick");
    	
    	$.ajax({
    		url: crud + ".json",
    		type: "POST",
    		data: JSON.stringify({
			name_car: $('#name_car').val(),
			description_car: $('#description_car').val(),
			time_active: $("#time_active").val(),
			time_inactive: $("#time_inactive").val(),
			status: 1}),

    	error: function(){

    	}, success: function(){
    	    
    		$.toast({
			    heading: 'Registrado correctamente',
			    showHideTransition: 'slide',
			    icon: 'success'
			});

			$("#btn_car").removeAttr("disabled");
			$("#btn_car").attr("onclick","n_car()");
			$("#car")[0].reset();
		}
    	});

    }else{
      
      swal('Datos requeridos', 'Favor de llenar el campo del mensaje', 'error');

    }
}

//function to delete data 
function d_car(key){

    $("#btn_"+key).removeAttr("onclick");
	$.ajax({
		url: crud + "/" + key + ".json",
		type: "DELETE",
	error: function(){

	}, success: function(){
	    
	
	}
	});

   
}

//snap for remove child of database
crud.on('child_removed', function(snap){
	
	$("."+snap.key()).hide(2000);
	$.toast({
		    heading: 'Eliminado correctamente',
		    showHideTransition: 'slide',
		    icon: 'success'
		});

});


// function to get data of the id sender
function rd_car(id){

	$.ajax({
		url: crud +'/'+id+'.json',
		type: 'GET',
	
	error: function(){


	},success: function(data){
		
		$("#btn_car").attr("onclick",'rw_car('+"'"+id+"'"+')');
		$("#name_car").val(data.name_car);
		$("#description_car").val(data.description_car);
		$("#time_active").val(data.time_active);
		$("#time_inactive").val(data.time_inactive);
		$("#title_name").html('Editar auto');

	}
	});

}

// function to edit data of the id sender
function rw_car(id){

	$("#btn_car").attr("disabled","disabled");

	$.ajax({
		url: crud +'/'+id+'.json',
		type: 'PATCH',
		data: JSON.stringify({
			name_car: $('#name_car').val(),
			description_car: $('#description_car').val(),
			time_active: $("#time_active").val(),
			time_inactive: $("#time_inactive").val()}),
	
	error: function(){


	},success: function(snap){

		$("#car")[0].reset();
		$("#btn_car").attr("onclick","n_car()");
		$("#btn_car").removeAttr("disabled");
		$("#title_name").html('Nuevo auto');

		
	}
	});

}


// function to change status of active or inactive 
function s_car(id, status){

	$.ajax({
		url: crud +'/'+id+'.json',
		type: 'PATCH',
		data: JSON.stringify({status: status}),
	
	error: function(){


	},success: function(snap){

		
	}
	});

}
