/**
 * 
 */
 
var crop_max_width = 400;
var crop_max_height = 400;
var jcrop_api;
var canvas;
var context;
var image;
var imageFileName;
var minHeight;
var maxHeight;
var minWidth;
var maxWidth;
var aspectRatio;
var callback;

$(document).on("change", "#photograph", function() {
	
	$(this).replaceWith('<input id="photograph" type="file" class="form-control">');
  
	if(!isCanvasSupported()){ // fallback mechanism for canvas, connecting to old upload functionality.
		var jq = document.createElement('script');
		jq.src = "./js/oldPhotoSignUpload.js";
		document.getElementsByTagName('head')[0].appendChild(jq);
		return false;
	}
  
	$("#picCrop").modal('show');
  aspectRatio = 240/320;
  minHeight = 320; maxHeight=320;
  minWidth = 240; maxWidth=240;
  callback = "uploadPhoto";
  loadImage(this);
  
});

$(document).on("change", "#signature", function() {
	  callback = "signPhoto";
	  $(this).replaceWith('<input id="signature" type="file" class="form-control">');
	  
	  if(!isCanvasSupported()){ // fallback mechanism for canvas, connecting to old upload functionality.
		  var jq = document.createElement('script');
		  jq.src = "./js/oldPhotoSignUpload.js";
		  document.getElementsByTagName('head')[0].appendChild(jq);
		  return false;
	  }
	  
	  $("#picCrop").modal('show');
	  minHeight = 80; maxHeight=280;
	  minWidth = 80; maxWidth=280;
	  aspectRatio =  280/80;
	  loadImage(this);
});

$('#picCrop').on('shown.bs.modal', function(e) {
  validateImage();
});

function isCanvasSupported(){
	 var elem = document.createElement('canvas');
	 return !!(elem.getContext && elem.getContext('2d'));
}

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

function validateImage() {
  if (canvas != null) {
    image = new Image();
    image.onload = affixJcrop;
    image.src = canvas.toDataURL('image/jpeg');
  } else affixJcrop();
}

function affixJcrop() {
	
  if (jcrop_api != null) {
	
    jcrop_api.destroy();
  }
  $("#views").empty();
  $("#views").append("<canvas id=\"canvas\">");
  canvas = $("#canvas")[0];
  context = canvas.getContext("2d");
  
  canvas.width = image.width;
  canvas.height = image.height;
  
  context.drawImage(image, 0, 0);
  
  $("#canvas").Jcrop({
    onSelect: selectcanvas,
    onRelease: clearcanvas,
   
    boxWidth: crop_max_width, 
    boxHeight: crop_max_height,
    minSize: [minWidth, minHeight],
    maxSize: [maxWidth, maxHeight],
    setSelect: [0, 0, minWidth, minHeight],
    aspectRatio: aspectRatio 
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
	console.log(coords)
  prefsize = {
    x: Math.round(coords.x),
    y: Math.round(coords.y),
    w: Math.round(coords.w),
    h: Math.round(coords.h)
  };
}

function applyCrop() {
  console.log("apply crop");
  
  if(prefsize.w > minWidth || prefsize.h > minHeight){ // Fix for preselected crop box cropping.
	  prefsize.w = minWidth;
	  prefsize.h = minHeight;
  }
  canvas.width = prefsize.w;
  canvas.height = prefsize.h;
  console.log(prefsize);
  console.log(canvas.width+"*"+canvas.height);
  context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
  validateImage(affixJcrop);
}

function applyRotate() {
  canvas.width = image.height;
  canvas.height = image.width;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(image.height / 2, image.width / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(image, -image.width / 2, -image.height / 2);
  validateImage(affixJcrop);
}

$("#cropbutton").click(function(e) {
  applyCrop();
});

$("#rotatebutton").click(function(e) {
  applyRotate();
});

$("#photoCropForm").submit(function(e) {
	  e.preventDefault();
	  
	  if(typeof width == 'undefined'){
		  $('#photoCropError').text("Please crop the Image");
		  $('#cropbutton').click();
	  }
	  
	  formData = new FormData($(this)[0]);
	  var blob = dataURLtoBlob(canvas.toDataURL('image/jpeg'));
	  window[callback](blob); // calling the image upload or sign upload
	 });

function uploadPhoto(blob){
	
	//TODO: Fix for checking 
	// var aspactRatio = width / height; 
	
	/*if(aspectRatio < 0.6605 || aspectRatio > 0.8930) {
		console.log("aspect ration in not currect");
	}*/
	
	formData.append("photograph", blob);
	  $.ajax({
	    url: "uploadPhotograph.html",
	    type: "POST",
	    data: formData,
	    contentType: false,
	    cache: false,
	    processData: false,
	    dataType: 'json',
	    beforeSend: function( data ) {
	    	data.context = $('p#uploadPhotoStatus');
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
	    			var img = '<img height="160" width="120" class="img-thumbnail" alt="Photograph" src="preview.html?photo=' + $('#enrolmentId').val() + '&t=' + (new Date()).getTime() + '" />';
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
	    	$('p#uploadPhotoStatus').text("Upload failed! File uploaded is not as per specification.").addClass("alert-danger");
	    })
		.always(function(data){ });
}

function signPhoto(blob){
	formData.append("signature", blob);
	  $.ajax({
	    url: "uploadSignature.html",
	    type: "POST",
	    data: formData,
	    contentType: false,
	    cache: false,
	    processData: false,
	    dataType: 'json',
	    beforeSend: function( data ) {
	    	data.context = $('p#uploadSignatureStatus');
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
        		$('p#uploadSignatureStatus').removeClass("alert-danger alert-success");
        		if(response.status)
        		{
        			var img = '<img height="50" width="150" class="img-thumbnail" alt="Signature" src="preview.html?sign=' + $('#enrolmentId').val() + '&t=' + (new Date()).getTime() + '" />';
        			$(".signatureThumbnail").html(img);
        			$('p#uploadSignatureStatus').text(response.message).addClass("alert-success");
        			
        			$('#signature').offsetParent().offsetParent().removeClass("has-error has-feedback");
        			$("#picCrop").modal('hide');
        		}
        		else
        		{
        			$('p#uploadSignatureStatus').text(response.message).addClass("alert-danger");
        			$("#picCrop").modal('hide');
        		}
        	}
	    })
	    .fail(function(data){ 
	    	$('p#uploadSignatureStatus').text("Upload failed! File uploaded is not as per specification.").addClass("alert-danger");
	    })
		.always(function(data){ });
}