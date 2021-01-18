import React, { useState, useCallback, useEffect } from "react";
import {
  Page,
  Card,
  Button,
  Icon,
  Heading,
  Toast,
  DropZone,
} from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";
import "./Gallery.css";
import AuthService from "./services/AuthService";
import UserService from "./services/UserService";

function Gallery({ signOut }) {
  const [images, setImages] = useState([]);
  const [toastActive, setToastActive] = useState(false);
  const firstName = AuthService.getCurrentUser().firstName;

  const toggleDeleteToast = useCallback(
    () => setToastActive((active) => !active),
    []
  );

  const toastMarkup = toastActive ? (
    <Toast content="Image deleted" onDismiss={toggleDeleteToast} />
  ) : null;

  useEffect(() => {
    UserService.getImages(AuthService.getCurrentUser().id)
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
  }, []);

  /**
   * Delete image
   * @param {*} e 
   * @param {*} id 
   */
  function deleteImage(e, id) {
    UserService.deleteImage(id)
      .then((response) => response.json())
      .then(response => {
        //Remove deleted image from state
        setImages(images.filter((img) => img._id !== response.id));

        // Show success toast
        if (toastActive) {
          // toggle Polaris toast off before toggling on again
          toggleDeleteToast();
          setTimeout(() => {
            toggleDeleteToast();
          }, 300);
        } else {
          toggleDeleteToast();
        }
      });

  }

  /**
  * Handler for images added to file input
  */
  const addImages = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      const form = new FormData();

      for (var i = 0; i < acceptedFiles.length; i++) {
        const src = `${AuthService.getCurrentUser().id}_${Date.now()}_${acceptedFiles[i].name}`;
        form.append("images", acceptedFiles[i], src);
      }

      UserService.uploadImages(AuthService.getCurrentUser().id, form)
        .then((response) => response.json())
        .then((imagesAdded) => {
          setImages(prevImages => [...imagesAdded, ...prevImages]);
        })
        .catch((error) => console.error(error));
    },
    []
  );

  return (
    <Page
      title={firstName + "'s Image Repo"}
      primaryAction={{ content: "Sign Out", onAction: signOut }}
    >
      <Card sectioned className="toolbar">
        <DropZone
          accept="image/*"
          type="image"
          onDrop={addImages}
          dropOnPage={true}
        >
          <DropZone.FileUpload />
        </DropZone>
      </Card>
      <Card sectioned>
        {images.length === 0 && <Heading>There are no images</Heading>}
        <div className="images">
          {images.map(function (image, index) {
            return (
              <div className="image-cell" key={index}>
                <div className="image-wrapper">
                  <img alt={image.src} src={"http://localhost:3200/" + image.src} />
                  <Button destructive onClick={(e) => deleteImage(e, image._id)}>
                    <Icon source={DeleteMajor} />
                  </Button>
                  <Heading className="image-filename">{image.name}</Heading>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {toastMarkup}
    </Page>
  );
}

export default Gallery;
