$(document).ready(function() {
    $.get("http://localhost:3000/users/1", function(user) {

        // Display location buttons
        for (const location of user.locations) {
            $('#menu').append(`<button type="button" class="btn btn-primary btn-location" id="${location.id}">${location.name}</button>`).append(' ');
        }

        // Display the first location in list
        displayLocation(user.locations[0]);

        // Handler for displaying new location when a location button is clicked
        $(".btn-location").click(function() {
            const locationId = parseInt($(this).attr('id'));
            $.get("http://localhost:3000/users/1", function(user) {
                for (const location of user.locations) {
                    if (location.id === locationId) {
                        displayLocation(location);
                    }
                }
            });
        });
    });

    // Save changes to a storage unit.
    $("#saveUnitChanges").click(function(event) {
        const locationId = $('#inputLocationId').val();
        const buildingId = $('#inputBuildingId').val();
        const unitId = $('#inputUnitId').val();

        // Update the modified storage unit in dataset
        $.get("http://localhost:3000/users/1", function(user) {
            for (const location of user.locations) {
                if (location.id === parseInt(locationId)) {
                    for (const building of location.buildings) {
                        if (building.name === buildingId) {
                            for (const unit of building.units) {
                                if (unit.name === unitId) {
                                    unit.tenant.first = $('#inputFirstName').val();
                                    unit.tenant.last = $('#inputLastName').val();
                                    unit.tenant.addressLine1 = $('#inputAddress').val();
                                    unit.tenant.addressLine2 = $('#inputAddress2').val();
                                    unit.tenant.city = $('#inputCity').val();
                                    unit.tenant.state = $('#inputState').val();
                                    unit.tenant.zip = $('#inputZip').val();
                                    unit.tenant.email = $('#inputEmail').val();
                                    unit.tenant.phone = $('#inputPhone').val();
                                }
                            }
                        }
                    }
                }
            }

            // Save dataset back to db
            const dataset = { users: [user] };
            console.log(JSON.stringify(user));
            $.ajax({
                url: 'http://localhost:3000/users/1',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(user),
                success: function(data) {
                    $('#unitModal').modal('hide');
                    // re-render the location so tool-tips work and such.
                    for (const location of user.locations) {
                        if (location.id === parseInt(locationId)) {
                            displayLocation(location);
                        }
                    }
                },
                error: function(data) {
                    alert(`Something went wrong saving data.  Here is the response:  ${JSON.stringify(data)}`);
                }
            });
        });
        event.preventDefault();
    });

    function displayLocation(location) {
        console.log(location.id);
        $.get("http://localhost:3000/users/1", function(user) {
            $("#location_section").empty();
            $("#location_section").append(`<h3 id="location_header">${location.name}</h3>`);
            const buildings = location.buildings;
            for (const building of buildings) {
                $("#location_section").append(`<h4 class="building_title">Building ${building.name}</h4>`);
                $("#location_section").append(`<div class="building" id="Building_${building.name}"></div>`);
                for (const unit of building.units) {
                    $(`#Building_${building.name}`).append(
                        `<div   class="storage_unit small occupied" 
                            id="Location_${location.id}_Building_${building.name}_Unit_${unit.name}" 
                            data-toggle="tooltip" data-placement="top" title="${unit.tenant.first} ${unit.tenant.last}"
                    >
                    </div>`);
                }
                // $(`#Building_${i}`).append(`<div style="clear:both;"></div>`);
            }

            // Attach click handler to newly create location units.  This has to be in this function, otherwise
            // it won't attach to newly created dom elements.  Or, you gotta do some magic to make it work, and I'm all outta magics.
            $(".storage_unit").click(function() {
                const storageUnitId = $(this).attr('id');
                console.log(JSON.stringify(storageUnitId.split('_')));
                const locationId = storageUnitId.split('_')[1];
                const buildingId = storageUnitId.split('_')[3];
                const unitId = storageUnitId.split('_')[5];
                $.get("http://localhost:3000/users/1", function(user) {
                    for (const location of user.locations) {
                        if (location.id === parseInt(locationId)) {
                            for (const building of location.buildings) {
                                if (building.name === buildingId) {
                                    for (const unit of building.units) {
                                        if (unit.name === unitId) {
                                            $('#unitModalLabel').text(`${location.name}: Building ${building.name} Unit ${unit.name}`);
                                            $('#inputLocationId').val(location.id);
                                            $('#inputBuildingId').val(building.name);
                                            $('#inputUnitId').val(unit.name);
                                            $('#inputFirstName').val(unit.tenant.first);
                                            $('#inputLastName').val(unit.tenant.last);
                                            $('#inputAddress').val(unit.tenant.addressLine1);
                                            $('#inputAddress2').val(unit.tenant.addressLine2);
                                            $('#inputCity').val(unit.tenant.city);
                                            $('#inputState').val(unit.tenant.state ? unit.tenant.state : `Choose...`);
                                            $('#inputZip').val(unit.tenant.zip);
                                            $('#inputEmail').val(unit.tenant.email);
                                            $('#inputPhone').val(unit.tenant.phone);
                                            $('#unitModal').modal({});
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });

            // Same with tooltip.  Gotta attach it here otherwise it don't show up
            // when locations are dynamically generated using ajaxish stuff.
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
});