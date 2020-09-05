const router = require('express').Router();
const Product = require('../models/product');

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = new aws.s3({ accessKeyId: '', secretAccessKey: '' }); // get from aws s3

// const upload = multer({
//   storage: multersS3({
//     s3: s3,
//     bucket: '', //aws s3 bucket name
//     metadata: function(req, file, cb) {
//       cb(null, { fieldName: file.fieldName });
//     },
//     key: function(req, file, cb) {
//       cb(null, Date.now().toString());
//     }
//   })
// });

router
  .route('/products')
  .get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded._id })
      .populate('owner')
      .populate('category')
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: 'Products',
            products
          });
        }
      });
  })
  .post(checkJWT, (req, res, next) => {
    let product = new Product();
    product.owner = req.decoded._id;
    console.log(req.body);
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.save();
    res.json({
      success: true,
      message: 'Successfully added the product'
    });
    //   .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
    //     let product = new Product();
    //     product.owner = req.decoded.user._id;
    //     product.category = req.body.categoryId;
    //     product.title = req.body.title;
    //     product.price = req.body.price;
    //     product.description = req.body.description;
    //     product.image = req.file.location;
    //     product.save();
    //     res.json({
    //       success: true,
    //       message: 'Successfully added the product'
    //     });
  });

// Just for testing
router.get('/faker/test', (req, res, next) => {
  for (let i = 0; i < 20; i++) {
    let product = new Product();
    product.owner = '5e4ec64bbb8e7306b0054952';
    product.category = '5e525171ff4d4f25c807a1f9';
    product.title = faker.commerce.productName();
    product.description = faker.lorem.words();
    product.price = faker.commerce.price();
    product.save();
  }
  res.json({
    success: true,
    message: 'Successfully added fake data.'
  });
});

module.exports = router;
