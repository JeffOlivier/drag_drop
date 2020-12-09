$( function() {
	let originalIconOrder = getIconOrder();
	let currentIconOrder = getIconOrder();
	$("#submitNewIconOrder").attr("disabled", true); //disable the submit button
	
	$( "#smGroup, #smGroup_not" ).sortable({
		revert: true, //the sortable items revert to their new positions using a smooth animation
		connectWith: "#smGroup, #smGroup_not" //allows icons to move between these two containers
	});
	
	// start off with the "update order" submit button disabled
	disableSocialMediaUpdateOrderButton();
	
	// The "update icon info" modal
	$( "#dialog-icon-form" ).dialog({
		modal: true,
      	autoOpen: false,
		height: "auto",
		width: 450,
		draggable: false,
		resizable: false,
      	closeText: "",
		show: true,
		buttons: [{ 
			text: "Save Changes",
			click: function() {
				const formSitecode = $('input[name="sitecode"]').val();
				const formTypeId = $('input[name="sm_typeid"]').val();
				const formTitle = $('input[name="sm_title"]').val();
				const formUrl = $('input[name="sm_url"]').val().replace(/^https?:\/\//i, "");
				updateSocialMediaIconInfo($(this), formSitecode, formTypeId, formTitle, formUrl);
			}
		}],
		close: () => {
			const iconTitle = $('input[name="sm_title"]').val();
			const iconUrl = $('input[name="sm_url"]').val().replace(/^https?:\/\//i, "");
			const iconTypeId = $('input[name="sm_typeid"]').val();
			const currentIconPointer = $('.socialmedia_single_icon[data-typeid='+iconTypeId+']');
			
			// Update the icon's title & url data attributes
			currentIconPointer.find('.sm_icon_edit').attr('data-title',iconTitle);
			currentIconPointer.find('.sm_icon_edit').attr('data-url',iconUrl);
			
			// Remove the error class if this icon has both pieces of info
			if (iconTitle !== "" && iconUrl !== "") {
				currentIconPointer.removeClass('error');
			} else {
				currentIconPointer.addClass('error');
			}
			
			// Update the "update order" submit button
			checkForOrderChangesFromCurrent(originalIconOrder, currentIconOrder);
			
			// Reset form fields back to blank
			$('#update-icon-form')[0].reset();
			
			// Remove all "old" hidden form fields
			$("#update-icon-form input[type='hidden']").remove();
		}
	});
	
	/* *** The container that holds social media icons shown on the site *** */
	// (note: order for sortable() is zero-based, so we add 1 to everything we do below)
	$( "#smGroup" ).sortable({
		update:  (event, ui) => {
			const currentIconPointer = ui.item.find('.sm_icon_edit');
			
			// If this icon just moved from "unused" to "used", open a modal if it isn't fully set up
			if (ui.sender !== null && ui.sender.is("#smGroup_not")) {
				// If this icon's title or url has not been set up yet, open a modal to update this info
				if (currentIconPointer.attr("data-title") === "" || currentIconPointer.attr("data-url") === "") {
					openUpdateModal(currentIconPointer);
				}
			}
			
			// Check to see if the maximum number of icons exist
			// var numIcons = xxx();
			// if (numIcons > max) { moveLastIconBack(); }
			
			// Update the data-order attributes of all used icons
			$('#smGroup > .socialmedia_single_icon').each( function (index) { $(this).attr('data-order', index+1); } ); // add 1 because index is zero-based
			
			// Update the data-order attribute of all unused icons to be 0
			$('#smGroup_not > .socialmedia_single_icon').each( index => { $(this).attr('data-order', 0); } );
			
			// Get the new order of the icons
			currentIconOrder = getIconOrder(); 
			
			// Update the "update order" submit button
			checkForOrderChangesFromCurrent(originalIconOrder, currentIconOrder);
		}
	});
	
	/* *** The container that holds social media icons that are NOT USED on the site *** */
	$( "#smGroup_not" ).sortable({ });
	
	/* ********************** */
	/* SET EVENTS ON THE PAGE */
	/* ********************** */
	$('#submitNewIconOrder').on('click', function (event) {
		$('#smGroup > .socialmedia_single_icon').each( index => {
			const singleIconSiteCode = $(this).attr('data-sitecode');
			const singleIconTypeId = $(this).attr('data-typeid');
			const singleIconOrder = $(this).attr('data-order');
			updateSingleSocialMediaIconOrder(singleIconSiteCode, singleIconTypeId, singleIconOrder);
		});
		
		// Set the order of all unused icons to be zero
		$('#smGroup_not > .socialmedia_single_icon').each( index => {
			const singleIconSiteCode = $(this).attr('data-sitecode');
			const singleIconTypeId = $(this).attr('data-typeid');
			updateSingleSocialMediaIconOrder(singleIconSiteCode, singleIconTypeId, 0);
		});
		
		// Disable the submit button
		disableSocialMediaUpdateOrderButton();
		
		// Update the original icon order variable
		originalIconOrder = getIconOrder();
	});
	
	// $('.sm_icon_edit').on('click', function(event) { openUpdateModal($(this)); });
	// $('.sm_icon_edit').on('click', (event) => { openUpdateModal($(this)); } );
	$('.sm_icon_edit').on('click', e => { openUpdateModal($(e.currentTarget)); } );
	
	// Replace characters that cause problems after each keypress
	$('#sm_title').on('keyup', e => {
		$(e.currentTarget).val( $(e.currentTarget).val().replace(/"/g, "'") );
	});
});


const enableSocialMediaUpdateOrderButton = () => {
	$("#submitNewIconOrder").addClass('enable').removeClass('disable');
	$("#submitNewIconOrder").attr("disabled", false);
}


const disableSocialMediaUpdateOrderButton = () => {
	$("#submitNewIconOrder").addClass('disable').removeClass('enable');
	$("#submitNewIconOrder").attr("disabled", true);
}


const getIconOrder = () => {
	let iconOrder = [];
	
	$('#smGroup > .socialmedia_single_icon').each(function (index) {
		iconOrder.push( $(this).attr("id").replace("ae_smtypeid_", "") );
	});
	
	return (iconOrder);
}

// Update the "Update Icon Order" submit button
const checkForOrderChangesFromCurrent = (originalIconOrder, currentIconOrder) => {
	// Only check the icon order if all of the icons have a title and url
	if ($("#smGroup .error").length > 0) {
		// One or more icons do not have their title or url set
		disableSocialMediaUpdateOrderButton();
	} else {
		// Check to see if the original order is different than the current order
		if (currentIconOrder == originalIconOrder) {
			disableSocialMediaUpdateOrderButton();
		} else {
			enableSocialMediaUpdateOrderButton();
		}
	}
}


const openUpdateModal = (pointerToIconEditButton) => {
	const icon = pointerToIconEditButton.parent();
	const updateTypeId = icon.attr("data-typeid");
	const typeName = icon.attr("data-typename");
	const updateSiteCode = icon.attr("data-sitecode");
	const updateTitle = pointerToIconEditButton.attr("data-title");
	const updateUrl = pointerToIconEditButton.attr("data-url");
	
	// Open the update form in a dialog modal
	$( "#dialog-icon-form" ).dialog( "open", "option", "title", "Edit "+typeName+" Info" );
	
	// Add the sitecode and icon type to the form for the current icon
	$('#update-icon-form').append('<input type="hidden" name="sitecode" value="'+updateSiteCode+'" /> ');
	$('#update-icon-form').append('<input type="hidden" name="sm_typeid" value="'+updateTypeId+'" /> ');
	
	// Update the title input value if it is already set
	if (updateTitle !== "") { $('#sm_title').val(updateTitle); }
	
	// Update the url input value if it is already set
	if (updateUrl !== "") { $('#sm_url').val(updateUrl); }
}

/* ***** AJAX CALLS ***** */
/* (not used in this application) */
const updateSingleSocialMediaIconOrder = (siteCode, typeId, order) => {
   /*
	$.ajax({
		url: '/plugins/ae3/lib/SocialMedia.cfc',
		data: {
			method: 'updateSocialMediaIconOrder',
			siteCode: siteCode,
			typeId: typeId,
			order: order
		},
		success: function(response) { },
		error: function(response) { console.log('UPDATE ICON ORDER ERROR'); }
	});
   */
  // alert('I have updated the order of a single social media icon to be '+order);
}


const updateSocialMediaIconInfo = (pointerToModal, siteCode, typeId, title, url) => {
   /*
	$.ajax({
		encoding: 'UTF-8',
		url: '/plugins/ae3/lib/SocialMedia.cfc',
		data: {
			method: 'updateSocialMediaIconInformation',
			siteCode: siteCode,
			typeId: typeId,
			title: title,
			url: url.replace(/^https?:\/\//i, "")
		},
		success: function(response) {
			// Close the dialog modal window
			pointerToModal.dialog( "close" );
		},
		error: function(response) { console.log('UPDATE ICON INFO ERROR'); }
	});
   */
   
   pointerToModal.dialog( "close" );
}


const getSocialMediaName = (typeId) => {
	/*
	$.ajax({
		url: '/plugins/ae3/lib/SocialMedia.cfc',
		data: {
			method: 'getSocialMediaName',
			typeId: typeId
		},
		success: function(response) { return(response); },
		error: function(response) { console.log('GET NAME ERROR'); }
	});
	*/
}
