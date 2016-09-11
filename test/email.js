
var key = '5375bb4ac97ba570cbf673a141b11c1985ded2f4';


var SparkPost = require('sparkpost');
var client = new SparkPost(key);

templateId = 'test-order';



client.transmissions.send({
  transmissionBody: {
    content: {
      template_id: templateId
    },
    recipients: [
      {address: 'amitava82@gmail.com', substitution_data: {
    	"orders":[{"name": "ipad", "price": 100},{"name": "iphone", "price": 200}] 
		}}
    ]
  }
}, function(err, res) {
  if (err) {
    console.log('Whoops! Something went wrong');
    console.log(err);
  } else {
    console.log('Woohoo! You just sent your first mailing!');
  }
});
