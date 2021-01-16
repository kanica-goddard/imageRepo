import React, { useState, useCallback, useEffect } from "react";
import "@shopify/polaris/dist/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  AppProvider,
  Frame,
  Page,
  Card,
  Button,
  Icon,
  Heading,
  Toast,
} from "@shopify/polaris";
import { AddImageMajor, DeleteMajor } from "@shopify/polaris-icons";

import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [toastActive, setToastActive] = useState(false);

  const toggleDeleteToast = useCallback(
    () => setToastActive((active) => !active),
    []
  );

  const toastMarkup = toastActive ? (
    <Toast content="Image deleted" onDismiss={toggleDeleteToast} />
  ) : null;

  useEffect(() => {
    fetch("http://localhost:3200/images", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
  }, []);

  /**
   * Handler for images added to file input
   * @param {*} imgFiles list of files to be uploaded
   */
  function handleUploaderChange(imgFiles) {
    const data = new FormData();

    for (let image of imgFiles) {
      data.append("files", image);
    }

    const requestOptions = {
      method: "POST",
      body: data,
    };
    fetch("http://localhost:3200/image/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        debugger
        setImages([data, ...images]);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Delete image
   * @param {*} e 
   * @param {*} id 
   */
  function deleteImage(e, id) {
    fetch(`http://localhost:3200/image/${id}`, { method: "DELETE" }).then((response) => response.json()).then(data => {
      //Remove deleted image from state
      setImages(images.filter((img) => img._id !== data.id));
    })

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
  }

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Kanika's Image Repo">
          <Card sectioned className="toolbar">
            <label className="upload">
              <input
                type="file"
                name="image-uploader"
                accept="image/*"
                multiple
                onChange={(e) => handleUploaderChange(e.target.files)}
              />
              <Icon source={AddImageMajor} />
              <Heading>
                Drag or click <span>here</span> to upload
              </Heading>
            </label>
          </Card>
          <Card sectioned>
            {images.length === 0 && <Heading>There are no images</Heading>}
            <div className="images">
              {images.map(function (image, index) {
                return (
                  <div className="image-cell" key={index}>
                    <div className="image-wrapper">
                      <img alt={image.src} src={'http://localhost:3200' + image.src} />
                      <Button
                        destructive
                        onClick={(e) => deleteImage(e, image._id)}
                      >
                        <Icon source={DeleteMajor} />
                      </Button>
                      <Heading className="image-filename">{image.name}</Heading>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Page>

        {toastMarkup}
      </Frame>
    </AppProvider>
  );
}

export default App;
