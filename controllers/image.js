const express = require("express");
const router = express.Router();
const imageModel = require("../models/image");
const fs = require('fs');

//Routes

//Shows all images
router.get("/images", (req, res) => {
    imageModel
        .find({})
        .then((images) => {
            //   const mappedProducts = products.map((product) => {
            //     return {
            //       id: product._id,
            //       productName: product.productName,
            //       description: product.description,
            //       quantity: product.quantity,
            //       productImage: product.productImage,
            //       category: product.category,
            //       price: product.price,
            //       isBestSeller: product.isBestSeller,
            //     };
            //   });

            res.send(images);
        })
        .catch((err) =>
            console.log(`Error occured when pulling from the database :${err}`)
        );
});

//Add a new image
router.post("/image", (req, res) => {
    console.log(req.files.files);

    imageModel.findOne({ name: req.files.files.name }).then(image => {
        //Filename already exists
        res.status(409).send("Filename already exists.");
    }).then(error => {
        //Move image to images folder
        req.files.files.mv(`public/images/${req.files.files.name}`).then(() => {
            console.log("Added to images folder");

            //Build object
            const newImage = {
                name: req.files.files.name,
                src: `/images/${req.files.files.name}`,
                size: req.files.files.size
            }

            //Save image model
            const image = new imageModel(newImage);
            image.save()
                .then((image) => {
                    console.log("Added to DB");
                    res.send(image);
                })
        })
    })



});

//Modify an existing image
router.put("/image", (req, res) => {

});

//Remove an existing image
router.delete("/image/:id", (req, res) => {
    const id = req.params.id;
    imageModel.findById(id).then(image => {
        //Delete local image file
        fs.unlink("./public" + image.src, (error) => {
            if (error) {
                console.log("Failed to delete local image:" + error);
            } else {
                console.log(`Deleted local image: ${image.src}`);

                //Delete from DB
                imageModel.findByIdAndDelete(id).then(data => {
                    console.log("Deleted from DB");
                    res.send({ id: id });
                });
            }
        });
    })

});

module.exports = router;
