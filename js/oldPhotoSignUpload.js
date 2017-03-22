/**
 *  Old photo and sign functionality for the browsers without canvas support
 */

  $('#photograph').fileupload({
    	url: 'uploadPhotograph.html',
    	formData: {enrolmentId: $('#enrolmentId').val()},
    	acceptFileTypes: /(\.|\/)(jpe?g)$/i,
        maxFileSize: 100,
        dropZone: null,
        pasteZone: null,
        fileInput: $('#photograph'),
        dataType: 'json',
        add: function(e, data){
        	data.context = $('p#uploadPhotoStatus');
        	
        	data.context.html('<img src="./img/ajax-loader.gif" alt="Uploading..." />');
        	data.submit();
        },
        done: function (e, data){
        	var response = data.result.files[0];
        	
        	if(!response.isRequestValid)
        	{
        		window.location = "requestDenied.html";
        	}
        	else
        	{
        		data.context.removeClass("alert-danger alert-success");
        		if(response.status)
        		{
        			var img = '<img height="160" width="120" class="img-thumbnail" alt="Photograph" src="preview.html?photo=' + $('#enrolmentId').val() + '&t=' + (new Date()).getTime() + '" />';
        			$(".photoThumbnail").html(img);
        			data.context.text(response.message).addClass("alert-success");
        			
        			$('#photograph').offsetParent().offsetParent().removeClass("has-error has-feedback");
        			
        		}
        		else
        		{
        			data.context.text(response.message).addClass("alert-danger");
        		}
        	}
        },
        fail: function(e, data){
        	data.context.text("Upload failed! File uploaded is not as per specification.").addClass("alert-danger");
        },
        always: function (e, data){
        	
        }
    });
    
    $('#signature').fileupload({
    	url: 'uploadSignature.html',
    	formData: {enrolmentId: $('#enrolmentId').val()},
    	acceptFileTypes: /(\.|\/)(jpe?g)$/i,
        maxFileSize: 100,
        dropZone: null,
        pasteZone: null,
        fileInput: $('#signature'),
        dataType: 'json',
        add: function(e, data){
        	data.context = $('p#uploadSignatureStatus');
        	
        	data.context.html('<img src="./img/ajax-loader.gif" alt="Uploading..." />');
        	data.submit();
        },
        done: function (e, data){
        	var response = data.result.files[0];
        	
        	if(!response.isRequestValid)
        	{
        		window.location = "requestDenied.html";
        	}
        	else
        	{
        		data.context.removeClass("alert-danger alert-success");
        		if(response.status)
        		{
        			var img = '<img height="50" width="150" class="img-thumbnail" alt="Signature" src="preview.html?sign=' + $('#enrolmentId').val() + '&t=' + (new Date()).getTime() + '" />';
        			$(".signatureThumbnail").html(img);
        			data.context.text(response.message).addClass("alert-success");
        			
        			$('#signature').offsetParent().offsetParent().removeClass("has-error has-feedback");
        		}
        		else
        		{
        			data.context.text(response.message).addClass("alert-danger");
        		}
        	}
        },
        fail: function(e, data){
        	data.context.text("Upload failed! File uploaded is not as per specification.").addClass("alert-danger");
        },
        always: function (e, data){
        	
        }
    });