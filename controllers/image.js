const express = require("express");
const router = express.Router();
const imageModel = require("../models/image");
const fs = require('fs');
const verifyToken = require("../middlewares/auth");

//Routes

//Shows all images for user
router.get("/images/:id", [verifyToken], (req, res) => {
    const id = req.params.id;
    console.log("Get images for: " + id);
    imageModel
        .find({ userAccess: id })
        .then((images) => {
            res.send(images);
        })
        .catch((err) =>
            console.log(`Error occured when pulling from the database :${err}`)
        );
});

/**
 * Helper function to save image to DB
 * @param {*} req request
 * @param {*} uploadedImage image to save
 */
const saveImage = async (req, uploadedImage) => {
    try {
        console.log("Save image: " + uploadedImage);

        //Build object
        const newImage = {
            name: uploadedImage.name,
            src: `/image_files/${uploadedImage.name}`,
            size: uploadedImage.size,
            userAccess: req.body.id
        }

        //Save image model
        const Image = new imageModel(newImage);
        let savedImage = await Image.save();
        console.log("Added to DB");
        console.log(savedImage);

        //Move image to images folder
        uploadedImage.mv(`public/image_files/${uploadedImage.name}`).then(() => {
            console.log("Added to images folder");
        })
        // });
        console.log("Saved Image", savedImage)
        return savedImage;

    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

//Add image(s)
router.post("/images", [verifyToken], async (req, res) => {
    let imagesAdded = [];

    if (req.files.images.length > 1) {
        for (let uploadedImage of req.files.images) {
            const imageAdded = await saveImage(req, uploadedImage);
            imagesAdded.push(imageAdded);
        }

        res.send(imagesAdded);
    }
    else {
        const imageAdded = await saveImage(req, req.files.images);
        imagesAdded.push(imageAdded);
        res.send(imagesAdded);
    }
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
                    console.log("Deleted from DB: " + data);
                    res.json({ id: data._id });
                });
            }
        });
    })

});

module.exports = router;
