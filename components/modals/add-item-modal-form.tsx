//components/app-page/add-item-modal-form.js
import { useNotification } from "@/context/notification-context";
import { itemValidate } from "@/lib/auth/item-validation/client";
import { getFormattedDate, getFormattedTime } from "@/lib/helpers/date";
import { ItemValues } from "@/lib/types/form-authentication";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Fragment, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { useItemsContext } from "../../context/items-context";
import { FormMotion } from "../ui/animations/reusable-motion-props/form-transition-props";
import Loader from "../ui/loading/loader";
import styles from "./modal-form.module.css";

function AddItemModalForm() {
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
      price: itemToEdit?.price || "",
      amount: itemToEdit?.amount || "",
      description: itemToEdit?.description || "",
    },
    validate: itemValidate,
    onSubmit: itemSubmitHandler,
  });
  const { values, errors, touched, handleSubmit, getFieldProps } = formik;

  async function itemSubmitHandler(values: ItemValues) {
    const enteredImageURL = imageURL || defaultImageURL;

    showNotification({
      type: "saving",
      message: "Saving...",
    });

    if (itemToEdit) {
      const editedItem = {
        id: itemToEdit.id,
        name: values.name,
        price: values.price,
        amount: values.amount,
        description: values.description,
        date_created: itemToEdit.date_created,
        time_created: itemToEdit.time_created,
        date_modified: getFormattedDate(),
        time_modified: getFormattedTime(),
        imageURL: enteredImageURL,
        imageFile: imageFile,
      };
      saveEditedItem(editedItem);
    } else {
      const newItem = {
        id: uuidv4(),
        name: values.name,
        price: values.price,
        amount: values.amount,
        description: values.description,
        date_created: getFormattedDate(),
        time_created: getFormattedTime(),
        date_modified: getFormattedDate(),
        time_modified: getFormattedTime(),
        imageURL: enteredImageURL,
        imageFile: imageFile,
      };
      addItem(newItem);
    }
    closeItemModal();
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
    <section className={styles.formBox}>
      <motion.form className={styles.itemForm} onSubmit={handleSubmit} {...FormMotion}>
        <label className={styles.customImageUploadLabel}>
          <input
            className={styles.imageFileInput}
            type={"file"}
            onChange={imageInputChangeHandler}
          />
          {imageURL ? (
            <Fragment>
              {!imageLoaded && <Loader message="loading image..." />}
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
          <div className={styles.customImageUploadLabelContents}>
            <div
              className={`${styles.customImageUploadLabelContentsOptions} ${
                imageURL ? "" : styles.visible
              }`}
            >
              <BiImageAdd />
              {imageURL ? <p>Change Image</p> : <p>Upload Image</p>}
            </div>
          </div>
        </label>

        <div className={styles.itemInfoBox}>
          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.inputText} ${
                  itemToEdit
                    ? !errors.name && styles.successInputText
                    : !errors.name && touched.name && styles.successInputText
                } ${
                  itemToEdit
                    ? errors.name && styles.errorInputText
                    : errors.name && touched.name && styles.errorInputText
                }`}
                type="text"
                id="name"
                {...getFieldProps("name")}
              />
              <label
                className={`${styles.inputLabel} ${
                  itemToEdit
                    ? !errors.name && styles.successLabel
                    : !errors.name && touched.name && styles.successLabel
                } ${
                  itemToEdit
                    ? errors.name && styles.errorLabel
                    : errors.name && touched.name && styles.errorLabel
                }`}
                htmlFor="name"
              >
                Name
              </label>
            </div>
            <AnimatePresence>
              {errors.name && touched.name && (
                <motion.span
                  className={styles.errorText}
                  key="errorMessage"
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
          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.inputText} ${
                  itemToEdit
                    ? !errors.price && styles.successInputText
                    : !errors.price && touched.price && styles.successInputText
                } ${
                  itemToEdit
                    ? errors.price && styles.errorInputText
                    : errors.price && touched.price && styles.errorInputText
                }`}
                type="text"
                id="price"
                {...getFieldProps("price")}
              />
              <label
                className={`${styles.inputLabel} ${
                  itemToEdit
                    ? !errors.price && styles.successLabel
                    : !errors.price && touched.price && styles.successLabel
                } ${
                  itemToEdit
                    ? errors.price && styles.errorLabel
                    : errors.price && touched.price && styles.errorLabel
                }`}
                htmlFor="price"
              >
                Price
              </label>
            </div>
            <AnimatePresence>
              {errors.price && touched.price && (
                <motion.span
                  className={styles.errorText}
                  key="errorMessage"
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
          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.inputText} ${
                  itemToEdit
                    ? !errors.amount && styles.successInputText
                    : !errors.amount && touched.amount && styles.successInputText
                } ${
                  itemToEdit
                    ? errors.amount && styles.errorInputText
                    : errors.amount && touched.amount && styles.errorInputText
                }`}
                type="text"
                id="amount"
                {...getFieldProps("amount")}
              />
              <label
                className={`${styles.inputLabel} ${
                  itemToEdit
                    ? !errors.amount && styles.successLabel
                    : !errors.amount && touched.amount && styles.successLabel
                } ${
                  itemToEdit
                    ? errors.amount && styles.errorLabel
                    : errors.amount && touched.amount && styles.errorLabel
                }`}
                htmlFor="amount"
              >
                Amount
              </label>
            </div>
            <AnimatePresence>
              {errors.amount && touched.amount && (
                <motion.span
                  className={styles.errorText}
                  key="errorMessage"
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
          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <textarea
                className={`${styles.inputText} ${styles.inputTextArea} ${
                  itemToEdit
                    ? !errors.description && styles.successInputText
                    : !errors.description && touched.description && styles.successInputText
                } ${
                  itemToEdit
                    ? errors.description && styles.errorInputText
                    : errors.description && touched.description && styles.errorInputText
                }`}
                id="description"
                {...getFieldProps("description")}
              ></textarea>
              <label
                className={`${styles.inputLabel} ${
                  itemToEdit
                    ? !errors.description && styles.successLabel
                    : !errors.description && touched.description && styles.successLabel
                } ${
                  itemToEdit
                    ? errors.description && styles.errorLabel
                    : errors.description && touched.description && styles.errorLabel
                }`}
                htmlFor="description"
              >
                Description
              </label>
              {/* <div className={styles.resizeHandle}></div> */}
            </div>
            <AnimatePresence>
              {errors.description && touched.description && (
                <motion.span
                  className={styles.errorText}
                  key="errorMessage"
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

          <div className={styles.submitAndCancelBtns}>
            <button type="button" className={styles.cancelBtn} onClick={closeItemModal}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {itemToEdit ? "Edit" : "Create"}
            </button>
          </div>
        </div>
      </motion.form>
    </section>
  );
}

export default AddItemModalForm;
