import { FormikErrors } from "formik";
import { ItemValues } from "../../types/form-authentication";

export function itemValidate(values: ItemValues) {
  const errors: FormikErrors<ItemValues> = {};
  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  } else if (/[^\w\s]/.test(values.name)) {
    errors.name = "Invalid name";
  } else if (values.name.length > 200) {
    errors.name = "Name is too long";
  }

  if (!values.price || !values.price.trim()) {
    errors.price = "Price is required";
  } else if (!/^\d+(\.\d{2})?$/.test(values.price)) {
    errors.price = "Invalid price: must be a number with up to 2 decimal places";
  } else if (values.price.length > 12) {
    errors.price = "Seems unlikely. Please contact the developer.";
  }


  if (!values.amount || !values.amount.trim()) {
    errors.amount = "Amount is required";
  } else if (/[^\d]/.test(values.amount)) {
    errors.amount = "Invalid Amount: contains symbols or whitespace";
  } else if (values.amount.length > 12) {
    errors.amount = "Seems unlikely. Please contact the developer.";
  }

  return errors;
}
