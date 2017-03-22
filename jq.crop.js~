(function ( $ ) {

$.fn.cropify = function(options) {
	var jcrop_api;
	var canvas;
	var context;
	var image;
	var imageFileName;
	var callback;
	var isSelected; 
	var photoNote = "Note: Upload a JPEG/JPG file of your photograph of maximum pixel resolution 480 x 640 and minimum pixel resolution 80 x 280. Aspect ratio (width : height) has to be between 0.6603 and 0.8933, Size of an image should be in a range of 5KB to 200KB.";
	var signNote = "Note: Upload a JPEG/JPG file of your signature of maximum pixel resolution 560 x 160 and minimum pixel resolution 280 x 80. Aspect ratio (width : height) has to be between 3.1586 and 4.0360, Size of an image should be in a range of 5KB to 150KB.";
	var thumbNote = "Note: Upload a JPEG/JPG file of your thumb impression having size in a range of 2KB to 150KB.";
  	var crop_max_width = 400;
	var crop_max_height = 400;

   	
	var defaults = {
		minHeight:1,
		maxHeight:1,
		minWidth:1,
		maxWidth:1,
		modal:'modal',
		note: photoNote,
		minAspectRatio:1.2,
		requestParamname:'photograph'
		maxAspectRatio:1
   	 };
 
   	 var settings = $.extend( {}, defaults, options );
 
   	 return this.each(function() {
   	     // Plugin code would go here...
   	 });
	
	
	$(document).on("change", this, function() {
		isSelected = false;
		$("#rotatebutton").show();
		disableCropButton();
		$(this).replaceWith('<input id="photograph" type="file" class="form-control">');
		$(default.modal).modal('show');
		$('#cropNote').text(photoNote);
		minAspectRatio = default.minAspectRaio;
		maxAspectRatio = default.minAspectRaio;
		minHeight = default.minHeight; 
		maxHeight= default.maxHeight;
		minWidth = default.minWidth; 
		maxWidth= default.maxWidth;
		callback = "uploadPhoto";
		loadImage(this);
	});

	$(default.modal).on('shown.bs.modal', function(e) {
		 validateImage();
	});

	function loadImage(input) {
		  if (input.files && input.files[0]) {
		    var reader = new FileReader();
	  	  
		  canvas = null;
		  reader.onload = function(e) {
	          image = new Image();
		  image.src = e.target.result;
	}

	reader.readAsDataURL(input.files[0]);
  }
}

function dataURLtoBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);

    return new Blob([raw], {
      type: contentType
    });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}

// validating image
function validateImage() {
  if (canvas != null) {
    image = new Image();
    image.onload = clear;
    image.src = canvas.toDataURL('image/jpeg');
  } else clear();
}


function clear() {
  var tempMinHeight,tempMinWidth;
  if (jcrop_api != null) {
    jcrop_api.destroy();
  }
  
  $(dafault.modal '.modal-body' div).empty();
  $(dafault.modal '.modal-body' div).append("<canvas id=\"canvas\">");
  canvas = $("#canvas")[0];
  context = canvas.getContext("2d");
  
  if(image.width < minWidth || image.height < minHeight) {
	  
	  tempMinWidth = image.width;
	  tempMinWidth = image.Height;
	  isImageSmall = true;
  }
  else {
	  tempMinWidth = minWidth;
	  tempMinHeight = minHeight;
  }
  
  canvas.width = image.width;
  canvas.height = image.height;
  
  context.drawImage(image, 0, 0);
  
  $("#canvas").Jcrop({
    onSelect: selectcanvas,
    onRelease: clearcanvas,
    boxWidth: crop_max_width, 
    boxHeight: crop_max_height,
    minSize: [tempMinWidth, tempMinHeight],
    maxSize: [maxWidth, maxHeight],
  }, function() {
    jcrop_api = this;
  });
  clearcanvas();
}

function clearcanvas() {
  prefsize = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
  };
}

function selectcanvas(coords) {
  prefsize = {
    x: Math.round(coords.x),
    y: Math.round(coords.y),
    w: Math.round(coords.w),
    h: Math.round(coords.h)
  };
    enableCropButton();
	var aspectRatio = prefsize.w / prefsize.h;
	aspectRatio = aspectRatio.toFixed(4);
	
	if(callback != "thumbImpression") {
		if(isImageSmall){
			$('#photoCropError').removeClass();
			$('#glyphiconId').removeClass().addClass('text-danger glyphicon glyphicon-remove');
			$('#photoCropError').text(" Current Image is too small to crop, Image should be in a [width:height] range "+minWidth+" to "+minHeight+".").addClass("has-error text-danger");;
		}
		
		if(prefsize.w <= maxWidth && prefsize.w >= minWidth){
			if(aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
				$('#photoCropError').removeClass();
				$('#glyphiconId').removeClass().addClass('text-danger glyphicon glyphicon-remove');
				$('#photoCropError').text(" Image aspect ratio should be in a range "+minAspectRatio+" to "+maxAspectRatio+". Current aspect ratio is "+aspectRatio).addClass("has-error text-danger");;
			}
			else {
				$('#photoCropError').removeClass();
				$('#glyphiconId').removeClass().addClass('text-success glyphicon glyphicon-ok');
				$('#photoCropError').text(" Image is perfect to upload").addClass("text-success has-success");
			}
		}
		else {
			if((prefsize.w >= maxWidth || prefsize.w <= minWidth)){
				$('#photoCropError').removeClass();
				$('#glyphiconId').removeClass().addClass('text-danger glyphicon glyphicon-remove');
				$('#photoCropError').text(" Image width should be in a between "+minWidth+" to "+maxWidth+". Current Width is "+prefsize.w).addClass("has-error text-danger");
			}
		    }
	}
	else{
		$("#errMessage").hide();
	}
}

function applyCrop() {

  canvas.width = prefsize.w;
  canvas.height = prefsize.h;

  context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
  validateImage(clear);
  $("#rotatebutton").hide();
}

function applyRotate() {
  canvas.width = image.height;
  canvas.height = image.width;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(image.height / 2, image.width / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(image, -image.width / 2, -image.height / 2);
  validateImage(clear);
}

function selectArea(){
	 jcrop_api.setSelect([0, 0, minWidth, minHeight]);
	 enableCropButton();
}

function enableCropButton(){
	$("#cropbutton").show();
	$("#startCropping").hide();
	$("#errMessage").show();
	$("#submitImage").val("Crop and Upload");
}

function disableCropButton(){
	$("#cropbutton").hide();
	$("#startCropping").show();
	$("#errMessage").hide();
	$("#submitImage").val("Upload Image");
}

$("#startCropping").click(function(e) {
	  selectArea();
});

$("#cropbutton").click(function(e) {
  applyCrop();
  disableCropButton();
});

$("#rotatebutton").click(function(e) {
  applyRotate();
  disableCropButton();
});


	

	$(default.modal form).submit(function(e) {
	  e.preventDefault();
	  
	  if(typeof width == 'undefined'){
		  $('#cropbutton').click();
	  }
	  
	  formData = new FormData($(this)[0]);
	  var blob = dataURLtoBlob(canvas.toDataURL('image/jpeg'));
	  window[callback](blob); // calling the image upload or sign upload
	 });

	function uploadPhoto(blob){
	
	formData.append(requestParamname, blob);
		  $.ajax({
		    url: default.url,
		    type: default.methodType,
		    data: formData,
		    contentType: false,
		    cache: false,
		    processData: false,
		    dataType: 'json',
		    beforeSend: function( data ) {
	            data.context = $('p#uploadPhotoStatus'); // get error element
	    	    data.context.html('<img src="./img/ajax-loader.gif" alt="Uploading..." />');
	 }
	 })
	    .done(function(data){ 
	    	var response = data.files[0];
	    	
	    	if(!response.isRequestValid)
	    	{
	    		window.location = "requestDenied.html";
	    	}
	    	else
	    	{
	    		$('p#uploadPhotoStatus').removeClass("alert-danger alert-success");
	    		if(response.status)
	    		{
	    			var img = '<img height="160" width="120" class="img-thumbnail" alt="Photograph" src="preview.html?photo=' + $('#enrolmentId').val() + '&t=' + (new Date()).getTime() + '" />'; // select on the basis of element selection
	    			$(".photoThumbnail").html(img);
	    			$('p#uploadPhotoStatus').text(response.message).addClass("alert-success");
	    			
	    			$('#photograph').offsetParent().offsetParent().removeClass("has-error has-feedback");
	    			$("#picCrop").modal('hide');
	    			
	    		}
	    		else
	    		{
	    			$('p#uploadPhotoStatus').text(response.message).addClass("alert-danger");
	    			$("#picCrop").modal('hide');
	    		}
	    	}
	    })
	    .fail(function(data){
	    	$('p#uploadPhotoStatus').text("Upload failed! Your session might be expired, please login again!").addClass("alert-danger");
	    })
		.always(function(data){ });
}

};

}( jQuery ));


  

// way to call
