/**
 * Created by amitava on 19/04/16.
 */
var elastic = require('../lib/core/elastic')({});
var Promise = require('bluebird');
var faker = require('faker');

var INDEX = 'raft';

var areas = [
    {
        name: 'JP Nagar',
        geo: [77.5857, 12.9105],
        pincode: 560078
    },
    {
        name: 'BTM',
        geo: [77.6101, 12.9166],
        pincode: 560030
    },
    {
        name: 'Indiranagar',
        geo: [77.6412, 12.9719],
        pincode: 560021
    },
    {
        name: 'Hesaraghatta',
        geo: [77.4900, 13.1500],
        pincode: 560090
    }
];

var courses = [
    {
        name: 'JEE Main',
        id: 'jee',
        category: 'entrance'
    },
    {
        name: 'IIT',
        id: 'iit',
        category: 'entrance'
    },
    {
        name: 'JEE Quick',
        id: 'jee-quick',
        category: 'entrance'
    },
    {
        name: 'CET',
        id: 'cet',
        category: 'entrance'
    }
];

elastic(function(er, client){
    var addr = faker.random.arrayElement(areas);
    var data = {
        name: faker.company.companyName(),
        description: faker.lorem.paragraph(),
        address: {
            locality: addr.name,
            geo: addr.geo,
            city: 'Bangalore',
            pincode: addr.pincode
        },
        location: addr.geo,
        type: 'institute',
        courses: [faker.random.arrayElement(courses), faker.random.arrayElement(courses)],
        active: true
    };
    client.create({
        index: INDEX,
        type: 'institute',
        id: faker.random.uuid(),
        body: data
    })
});