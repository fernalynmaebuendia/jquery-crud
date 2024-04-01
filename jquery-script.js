$(document).ready(function(){
    function validateForm(event) {
        var form = document.getElementById("myForm");
        
        // Validate form
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add("was-validated");

            // Add the timeout for invalid-feedback messages
            setTimeout(function() {
                form.classList.remove('was-validated');
                $(".invalid-feedback").fadeOut(3000, function() {
                    $(this).removeClass("show");
                });
            }, 3000);
            return false;
        }
        
        form.classList.remove('was-validated');
        return true;
    }

    // Show data
    function showData() {
        $("#userData").empty();
        var allData = JSON.parse(localStorage.getItem("userData")) || [];

        // Table data
        allData.forEach(function(data) {
            $("#userData").prepend("<tr><td>" + data.idNo + "</td><td>" + data.firstName + "</td><td>" + data.lastName + "</td><td>" + data.email + "</td><td>" + data.mobileNo + "</td><td>" + data.location + "</td><td><button class='btn btn-primary m-2 editBtn'><i class='bi bi-pencil-square'></i></button> <button class='btn btn-danger m-2 deleteBtn'><i class='bi bi-trash'></i></button></td></tr>");
        }); 
    }

    // Load submitted data on page load
    showData();

    // Submit form
    $("#myForm").submit(function(event) {
        // Prevent form from submitting
        event.preventDefault();

        // Get data from form fields value
        var idNo = $("input[name='idNo']").val();
        var email = $("input[name='email']").val();
        var firstName = $("input[name='firstName']").val();
        var lastName = $("input[name='lastName']").val();
        var mobileNo = $("input[name='mobileNo']").val();
        var location = $("input[name='location']").val();
        
        // Validate form
        if (!validateForm(event)) {
            setTimeout(function() {
                $(".invalid-feedback").fadeOut(5000, function() {
                    $(this).removeClass("show");
                });
            }, 3000)
            return;
        }

        // Validate mobile number
        // const errorMessage = $("#invalid-feedback");
        // if (isNaN(mobileNo) || mobileNo.toString().length !== 11) {
        //     errorMessage.text = "Please enter a valid email address";
        //     return;
        // } else {
        //     errorMessage.text = "";
        // }
        
        // Setting edit input field 
        var editIndex = $("#editIndex").val();

        // Store or update data in local storage
        var allData = JSON.parse(localStorage.getItem("userData")) || [];
        if (editIndex !== "") {
            // Update existing record
            allData[editIndex] = {
                idNo: idNo,
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobileNo: mobileNo,
                location: location
            };
        } else {
            // Add new record
            allData.push({
                idNo: idNo,
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobileNo: mobileNo,
                location: location
            });
        }
        localStorage.setItem("userData", JSON.stringify(allData));

        // Reset form fields
        $("#idNo, #email, #firstName, #lastName, #mobileNo, #location").val("");
        
        // Clear the editIndex
        $("#editIndex").val("");
            
        // Hide update button and show submit button
        $("#editBtn").hide();
        $("#submit").show();
        
        // Re-render the table
        showData();

        if (editIndex !== "") {
            alert("Record updated successfully!");
        } else {
            alert("Form submitted successfully!");
        }
        
    });

    //Delete
    $(document).on("click", ".deleteBtn", function() {
        var row = $(this).closest("tr");
        var columns = row.find("td");
        var idNo = $(columns[0]).text();

        // Remove the row from the table
        row.remove();

        // Remove the data from local storage
        var allData = JSON.parse(localStorage.getItem("userData")) || [];
        allData = allData.filter(function(data) {
            return data.idNo !== idNo;
        });
        localStorage.setItem("userData", JSON.stringify(allData));
        
        alert("Delete successfully!");
    });

    // Update 
    $(document).on("click", ".editBtn", function() {
        var row = $(this).closest("tr");
        var columns = row.find("td");
        var idNo = $(columns[0]).text();
        
        // Find the data in local storage by idNo
        var allData = JSON.parse(localStorage.getItem("userData")) || [];
        var dataIndex = allData.findIndex(function(data) {
            return data.idNo === idNo;
        });
        
        if (dataIndex !== -1) {
            // Populate the form fields with the data
            var data = allData[dataIndex];
            $("#idNo").val(data.idNo);
            $("#email").val(data.email);
            $("#firstName").val(data.firstName);
            $("#lastName").val(data.lastName);
            $("#mobileNo").val(data.mobileNo);
            $("#location").val(data.location);
            
            // Hide submit button and show update button
            $("#submit").hide();
            $("#editBtn").show();
            
            // Store the index of the data being edited
            $("#editIndex").val(dataIndex);
        }
    });
});

