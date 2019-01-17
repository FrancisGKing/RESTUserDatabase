// user list data array for filling in info box
var userListData = [];

// DOM ready
$(document).ready(function() {
  // populate user table on initial page load
  populateTable();
});

//Username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

// Add User button click
$('#btnAddUser').on('click', addUser);

//Delete user click link
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

//Functions

//Fill table with data
function populateTable() {


  //Empty content string
  var tableContent = '';

  // jquery AJAX call for JSON
  $.getJSON( '/users/userlist', function( data ) {

    //Put user data array into userlist variable in the global object
    userListData = data;

    // For each item in JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username +'">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inejct the content string into our existing HTML table
    $('#userList table tbody').html(tableContent);

  });
};

//Show user user info
function showUserInfo(event) {

  //Prevent link from firing
  event.preventDefault();

  // retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username;  }).indexOf(thisUserName);

  // Get our User object
  var thisUserObject = userListData[arrayPosition];

  //Populate Info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);

};

//Add user function
function addUser(event) {
  // prevent link from firing
  event.preventDefault();

  // Form Validation - increase error count variable if fields are left blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  //Check if errorCount is zero
  if(errorCount === 0) {

    //If errorCount is zero, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      //Check for successful (blank) response
      if (response.msg === '') {

        //Clear input forms
        $('#addUser fieldset input').val('');

        //Update the table
        populateTable();
      }
      else {

        // If there is an error, alert with error message
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    //If errorCount is not zero, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete User
function deleteUser(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check that user confirmed
  if (confirmation === true) {

    // If they did, proceed with deletion
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If user did not confirm, do nothing
    return false;

  }

};
