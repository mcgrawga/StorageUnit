var faker = require('faker');

var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard();

function units(numUnits) {
    const units = [];
    for (let i = 1; i <= numUnits; i++) {
        units.push({
            name: `${i}`,
            width: 10,
            length: 30,
            tenant: {
                first: faker.name.firstName(),
                last: faker.name.lastName(),
                addressLine1: faker.address.streetAddress(),
                addressLine2: faker.address.secondaryAddress(),
                city: faker.address.cityName(),
                state: faker.address.state(),
                zip: faker.address.zipCode("#####"),
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber()
            }
        });
    }
    return units;
}

function buildings(numBuildings, numUnits) {
    const buildings = [];
    for (let i = 1; i <= numBuildings; i++) {
        buildings.push({
            name: `${i}`,
            units: units(numUnits)
        });
    }
    return buildings;
}

function locations(numLocations, numBuildings, numUnits) {
    const locations = [];
    for (let i = 1; i <= numLocations; i++) {
        locations.push({
            id: i,
            name: faker.address.cityName(),
            buildings: buildings(numBuildings, numUnits)
        });
    }
    return locations;
}

const db = {};
db.users = [{
    id: 1,
    locations: locations(3, 2, 10) // num of locations, num building per location, num units per building.
}];
console.log(`${JSON.stringify(db)}`);