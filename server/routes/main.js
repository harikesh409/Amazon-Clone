const router = require('express').Router();
const async = require('async');

const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');

const checkJWT = require('../middlewares/check-jwt');

router.get('/products', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel(
    [
      function(callback) {
        Product.countDocuments((err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(callback) {
        Product.find({})
          .skip(page > 0 ? perPage * (page - 1) : 0)
          .limit(perPage)
          .populate('category')
          .populate('owner')
          .exec((err, products) => {
            if (err) return next(err);
            callback(err, products);
          });
      }
    ],
    function(err, results) {
      if (err) {
        res.json({
          success: false,
          err
        });
      } else {
        var totalProducts = results[0];
        var products = results[1];
        res.json({
          success: true,
          message: 'Products',
          products,
          totalProducts,
          pages: Math.ceil(totalProducts / perPage)
        });
      }
    }
  );
});

router
  .route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      if (err) {
        res.json({
          success: false,
          message: err,
          categories: []
        });
      } else {
        res.json({
          success: true,
          message: 'Success',
          categories
        });
      }
    });
  })
  .post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category
      .save()
      .then(() => {
        res.json({
          success: true,
          message: 'Successful'
        });
      })
      .catch(err => {
        res.json({
          success: false,
          message: err.errmsg
        });
      });
  });

router.get('/categories/:id', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel(
    [
      function(callback) {
        Product.countDocuments({ category: req.params.id }, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(callback) {
        Product.find({ category: req.params.id })
          .skip(page > 0 ? perPage * (page - 1) : 0)
          .limit(perPage)
          .populate('category')
          .populate('owner')
          .populate('reviews')
          .exec((err, products) => {
            if (err) return next(err);
            callback(err, products);
          });
      },
      function(callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
          callback(err, category);
        });
      }
    ],
    function(err, results) {
      var totalProducts = results[0];
      var products = results[1];
      var category = results[2];
      res.json({
        success: true,
        message: 'category',
        products,
        categoryName: category.name,
        totalProducts,
        pages: Math.ceil(totalProducts / perPage)
      });
    }
  );
});

router.get('/product/:id', (req, res, next) => {
  Product.findById({ _id: req.params.id })
    .populate('category')
    .populate('owner')
    .deepPopulate('reviews.owner')
    .exec((err, product) => {
      if (err) {
        res.json({
          success: false,
          message: 'Product not found',
          err
        });
      } else {
        res.json({
          success: true,
          message: 'Product found',
          product
        });
      }
    });
});

router.post('/review', checkJWT, (req, res, next) => {
  async.waterfall([
    function(callback) {
      Product.findOne({ _id: req.body.productId }, (err, product) => {
        if (product) {
          callback(err, product);
        }
      });
    },
    function(product) {
      let review = new Review();
      review.owner = req.decoded._id;
      if (req.body.title) review.title = req.body.title;
      if (req.body.description) review.description = req.body.description;
      review.rating = req.body.rating;
      product.reviews.push(review);
      product.save();
      review.save();
      res.json({
        success: true,
        message: 'Successfully added the review.'
      });
    }
  ]);
});

module.exports = router;
