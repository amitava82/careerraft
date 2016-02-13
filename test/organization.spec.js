/**
 * Created by amitava on 12/02/16.
 */
//require("babel-register");

var Organization = require('../lib/models/Organization')();
var Category = require('../lib/models/Category')();
var Course = require('../lib/models/Course')();
var Subject = require('../lib/models/Subject')();
var config = require('config');
var db = require('../lib/core/mongodb')({config: config});
var ObjectId = require('mongoose').Types.ObjectId;

db(function(){

    //Insert

    var o = {
      name: 'something',
      classes: [
          {
              name: 'Disco',
              category: '56b33d6a52b2830e427954e0',
              course: 'Dance'
          }, {
              name: 'English',
              id: 1212,
          }
      ]
    };

    var o2 = {
        name: 'something',
        categories: [
            {
                id: 1,
                name: 'Hobby classes',
                courses: [
                    {
                        name: 'Dance',
                        id: 'bv5',
                        subjects: [
                            {
                                name: 'disco',
                                id: 'hu7'
                            }
                        ]
                    }
                ]
            }
        ]
    };

    var o3 = {
        name: 'something',
        subjects: [
            {
                name: 'salsa',
                _id: '1',
                category: 'hobby',
                course: 'dance'
            }
        ]
    }

    //var o = new Organization({
    //    name: 'Arena Net Indiranagar',
    //    description: 'arena net teaches animation, maya, 3d modeling and game development',
    //    parent: '56bd8d100f56ff5cbab348b3',
    //    address: {
    //        line1: '12th main road',
    //        locality: 'Indiranagar',
    //        city: 'Bangalore',
    //        State: 'KA',
    //        pincode: 560076,
    //        loc: [12.9947034,77.5345687]
    //    },
    //    email: 'amitav@something.com',
    //    phone: [{name: 'main', number: 12121212121}],
    //    website: 'google.com',
    //    categories: [
    //        {
    //            name: "Hobby Classes",
    //            category: "56b33d6a52b2830e427954e0"
    //        }
    //    ]
    //
    //});
    //
    //o.save().then(function(d){
    //    console.log(d);
    //}, function(e){
    //    console.log(e)
    //})

    //
    //Organization.find(
    //    {$text: {$search: ''}, 'address.loc': {$near: [77.5945626999999831, 12.9715986999999995]}},
    //    {score: {$meta: 'textScore'}}
    //).then(function(r){
    //    console.log(r)
    //}, function (e) {
    //    console.log(e)
    //});

    //db.txtgeo.find({$text:{$search:"fox"}, loc: {$geoWithin : {$center: [[33.22, 84.12], 200]}}})

    /*
    Query
     */
    Organization.aggregate([
        {
            $match: {
                $text: {$search: 'Arena'},
                'address.loc': {$geoWithin:  {$centerSphere: [[ 80.2399999999999949, 13.0600000000000005], 400/6371]}},
                'categories.category': ObjectId('56b33d6a52b2830e427954e0')
            }

        },
        //{
        //    $lookup: {
        //        from: 'categories',
        //        localField: 'categories.category',
        //        foreignField: '_id',
        //        as: 'categoryDoc'
        //    }
        //},
        {
            $project: {
                '_id': 1,
                'name': 1,
                'description': 1,
                'categories': 1,
                'categoryDoc': 1,
                score : {$meta: 'textScore'}
            }
        },
        {
          $sort:{score: {$meta: 'textScore'}}
        },
        {
            $skip: 0
        },
        {
            $limit: 10
        }
    ]).exec(handle);

    //Organization.find({'categories.category': '56b33d6a52b2830e427954e0'}).populate('categories.category').exec(handle)
});


function handle(fail, success){
    if(fail) console.log(fail)
    else console.log(JSON.stringify(success , null, 4))
}