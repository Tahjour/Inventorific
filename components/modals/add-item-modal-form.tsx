//components/app-page/add-item-modal-form.js
import { useNotification } from "@/context/notification-context";
import { itemValidate } from "@/lib/auth/item-validation/client";
import { getFormattedDate, getFormattedTime } from "@/lib/helpers/date";
import { PendingMessages } from "@/lib/helpers/messages";
import { ItemValues } from "@/lib/types/form-authentication";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Fragment, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { useItemsContext } from "../../context/items-context";
import { FormMotion } from "../ui/animations/motion-props/form-transition-props";
import MainLoader from "../ui/loading/main-loader";

function ItemModalForm() {
  const { showNotification } = useNotification();
  const { getItemToEdit, saveEditedItem, closeItemModal, addItem } = useItemsContext();
  const itemToEdit = getItemToEdit();
  const [imageURL, setImageURL] = useState(itemToEdit?.imageURL);
  const [imageFile, setImageFile] = useState(itemToEdit?.imageFile);
  const [imageLoaded, setImageLoaded] = useState(false);
  //locally hosted default item image for when user isn't logged in.
  const defaultImageURL = "/default_image.png";

  const formik = useFormik({
    initialValues: {
      name: itemToEdit?.name || "",
      price: itemToEdit?.price.toFixed(2) || "",
      amount: itemToEdit?.amount.toString() || "",
      description: itemToEdit?.description || "",
    },
    validate: itemValidate,
    onSubmit: itemSubmitHandler,
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  async function itemSubmitHandler(values: ItemValues) {
    const enteredImageURL = imageURL || defaultImageURL;

    showNotification({
      type: "saving",
      message: PendingMessages.Saving,
    });
    closeItemModal();

    if (itemToEdit) {
      const editedItem = {
        id: itemToEdit.id,
        name: values.name,
        price: parseFloat(values.price),
        amount: parseFloat(values.amount),
        description: values.description,
        date_created: itemToEdit.date_created,
        time_created: itemToEdit.time_created,
        date_modified: getFormattedDate(),
        time_modified: getFormattedTime(),
        imageURL: enteredImageURL,
        imageFile: imageFile,
      };
      await saveEditedItem(editedItem);
    } else {
      const newItem = {
        id: uuidv4(),
        name: values.name,
        price: parseFloat(values.price),
        amount: parseFloat(values.amount),
        description: values.description,
        date_created: getFormattedDate(),
        time_created: getFormattedTime(),
        date_modified: getFormattedDate(),
        time_modified: getFormattedTime(),
        imageURL: enteredImageURL,
        imageFile: imageFile,
      };
      await addItem(newItem);
    }
  }

  function imageInputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      //Need to store image file to upload on cloudinary via backend if necessary
      //Only imageURL is needed to display image in this component
      //The imageURL will be a temporary Blob URL at first.
      //Then it will be converted to a Cloudinary URL
      const imgFile = event.target.files[0];
      setImageFile(imgFile);
      setImageURL(URL.createObjectURL(imgFile));
    }
  }

  function handleImageLoad() {
    setImageLoaded(true);
  }

  return (
    <section className={"modalFormSectionBox"}>
      <motion.form className={"modalFormItemForm"} onSubmit={handleSubmit} {...FormMotion}>
        <label className={"modalFormUploadLabel"}>
          <input
            className={"modalFormImageFileInput"}
            type={"file"}
            onChange={imageInputChangeHandler}
          />
          {imageURL ? (
            <Fragment>
              {!imageLoaded && <MainLoader message="loading image..." />}
              {/* Show the loader when the image is not loaded */}
              <Image
                src={imageURL}
                alt={"Selected Image"}
                fill
                sizes="(max-width: 640px) 90vw, 100vw"
                onLoadingComplete={handleImageLoad}
              />
            </Fragment>
          ) : null}
          <div className={"modalFormUploadLabelOptionBox"}>
            <div
              className={`${"modalFormUploadLabelOption"} ${
                imageURL ? "" : "modalFormUploadLabelOptionVisible"
              }`}
            >
              <BiImageAdd />
              {imageURL ? <p>Change Image</p> : <p>Upload Image</p>}
            </div>
          </div>
        </label>

        <div className={"modalFormItemInfoBox"}>
          <div className={"modalFormInputBox"}>
            <div className={"modalFormInputBox2"}>
              <input
                className={`${"modalFormTextInput"} ${
                  itemToEdit
                    ? !errors.name && "modalFormSuccessOutline"
                    : !errors.name && touched.name && "modalFormSuccessOutline"
                } ${
                  itemToEdit
                    ? errors.name && "modalFormErrorOutline"
                    : errors.name && touched.name && "modalFormErrorOutline"
                }`}
                type="text"
                id="name"
                {...getFieldProps("name")}
              />
              <label
                className={`${"modalFormInputLabel"} ${
                  itemToEdit
                    ? !errors.name && "modalFormSuccessLabel"
                    : !errors.name && touched.name && "modalFormSuccessLabel"
                } ${
                  itemToEdit
                    ? errors.name && "modalFormErrorLabel"
                    : errors.name && touched.name && "modalFormErrorLabel"
                }`}
                htmlFor="name"
              >
                Name
              </label>
            </div>
            <AnimatePresence>
              {errors.name && touched.name && (
                <motion.span
                  className={"modalFormErrorMessage"}
                  key="modalFormErrorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className={"modalFormInputBox"}>
            <div className={"modalFormInputBox2"}>
              <input
                className={`${"modalFormTextInput"} ${
                  itemToEdit
                    ? !errors.price && "modalFormSuccessOutline"
                    : !errors.price && touched.price && "modalFormSuccessOutline"
                } ${
                  itemToEdit
                    ? errors.price && "modalFormErrorOutline"
                    : errors.price && touched.price && "modalFormErrorOutline"
                }`}
                type="text"
                id="price"
                {...getFieldProps("price")}
              />
              <label
                className={`${"modalFormInputLabel"} ${
                  itemToEdit
                    ? !errors.price && "modalFormSuccessLabel"
                    : !errors.price && touched.price && "modalFormSuccessLabel"
                } ${
                  itemToEdit
                    ? errors.price && "modalFormErrorLabel"
                    : errors.price && touched.price && "modalFormErrorLabel"
                }`}
                htmlFor="price"
              >
                Price
              </label>
            </div>
            <AnimatePresence>
              {errors.price && touched.price && (
                <motion.span
                  className={"modalFormErrorMessage"}
                  key="modalFormErrorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.price}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className={"modalFormInputBox"}>
            <div className={"modalFormInputBox2"}>
              <input
                className={`${"modalFormTextInput"} ${
                  itemToEdit
                    ? !errors.amount && "modalFormSuccessOutline"
                    : !errors.amount && touched.amount && "modalFormSuccessOutline"
                } ${
                  itemToEdit
                    ? errors.amount && "modalFormErrorOutline"
                    : errors.amount && touched.amount && "modalFormErrorOutline"
                }`}
                type="text"
                id="amount"
                {...getFieldProps("amount")}
              />
              <label
                className={`${"modalFormInputLabel"} ${
                  itemToEdit
                    ? !errors.amount && "modalFormSuccessLabel"
                    : !errors.amount && touched.amount && "modalFormSuccessLabel"
                } ${
                  itemToEdit
                    ? errors.amount && "modalFormErrorLabel"
                    : errors.amount && touched.amount && "modalFormErrorLabel"
                }`}
                htmlFor="amount"
              >
                Amount
              </label>
            </div>
            <AnimatePresence>
              {errors.amount && touched.amount && (
                <motion.span
                  className={"modalFormErrorMessage"}
                  key="modalFormErrorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.amount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className={"modalFormInputBox"}>
            <div className={"modalFormInputBox2"}>
              <textarea
                className={`${"modalFormTextInput"} ${"modalFormTextAreaInput"} ${
                  itemToEdit
                    ? !errors.description && "modalFormSuccessOutline"
                    : !errors.description && touched.description && "modalFormSuccessOutline"
                } ${
                  itemToEdit
                    ? errors.description && "modalFormErrorOutline"
                    : errors.description && touched.description && "modalFormErrorOutline"
                }`}
                id="description"
                {...getFieldProps("description")}
              ></textarea>
              <label
                className={`${"modalFormInputLabel"} ${
                  itemToEdit
                    ? !errors.description && "modalFormSuccessLabel"
                    : !errors.description && touched.description && "modalFormSuccessLabel"
                } ${
                  itemToEdit
                    ? errors.description && "modalFormErrorLabel"
                    : errors.description && touched.description && "modalFormErrorLabel"
                }`}
                htmlFor="description"
              >
                Description
              </label>
              {/* <div className={resizeHandle}></div> */}
            </div>
            <AnimatePresence>
              {errors.description && touched.description && (
                <motion.span
                  className={"modalFormErrorMessage"}
                  key="modalFormErrorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.description}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={"modalFormSubmitBtns"}>
            <button type="button" className={"modalFormCancelBtn"} onClick={closeItemModal}>
              Cancel
            </button>
            <button type="submit" className={"modalFormSubmitBtn"}>
              {itemToEdit ? "Edit" : "Create"}
            </button>
          </div>
        </div>
      </motion.form>
    </section>
  );
}

export default ItemModalForm;
