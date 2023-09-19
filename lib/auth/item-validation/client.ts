import { FormikErrors } from "formik";
import { ItemValues } from "../../types/form-authentication";

export function itemValidate(values: ItemValues) {
  const errors: FormikErrors<ItemValues> = {};
  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  } else if (/[^a-zA-Z0-9_\s-"'().]/g.test(values.name)) {
    errors.name = "Invalid name";
  } else if (values.name.length > 200) {
    errors.name = "Name is too long";
  }


  if (!values.price || !values.price.trim()) {
    errors.price = "Price is required";
  } else if (!/^[1-9]\d*(\.\d{2})?$/.test(values.price)) {
    errors.price =
      "Invalid price: must be a number starting from 1 to 9 with up to 2 decimal places";
  } else if (parseFloat(values.price) > 1000000000000) {
    errors.price = "Seems unlikely. Please contact the developer.";
  }

  if (!values.amount || !values.amount.trim()) {
    errors.amount = "Amount is required";
  } else if (!/^[1-9]\d*$/.test(values.amount)) {
    errors.amount = "Invalid Amount: must be a number starting from 1 to 9";
  } else if (parseFloat(values.amount) > 1000000000000) {
    errors.amount = "Seems unlikely. Please contact the developer.";
  }

  return errors;
}
