export const ErrorMessages = {
  UserNotFound: "User not found in database",
  UserAlreadyExists: "User already exists",
  UserDeleteFailed: "Failed to delete user. Please contact the developer.",
  UserNotAuthorized: "User is not authorized. Login to save changes.",
  UserValidationFailed: "User validation failed",
  EmailAlreadyExists: "Email already exists",
  PasswordGenerateFailed: "Failed to generate password. Please contact the developer.",
  UserCreationFailed: "Failed to create user. Please contact the developer.",
  UserLoginFailed: "Failed to sign in user. Please contact the developer.",
  UserLogoutFailed: "Failed to sign out user. Please contact the developer.",
  NoUserToEdit: "No user to edit",
  NoUserToDelete: "No user to delete",

  ItemNotFound: "Item not found",
  ItemAlreadyExists: "Item already exists",
  ItemCreationFailed: "Failed to add item on server. Please contact the developer.",
  ItemEditFailed: "Failed to edit item on server. Please contact the developer.",
  ItemDeleteFailed: "Failed to delete item on server. Please contact the developer.",
  NoItemToCreate: "No item to create",
  NoItemToEdit: "No item to edit",
  NoItemToDelete: "No item to delete",
  ItemValidationFailed: "Item validation failed",
  PreferredListTypeSaveFailed: "Failed to save preferred list type. Please contact the developer.",
  UserOperationsUpdateFailed: "Failed to update user operations. Please contact the developer.",

  InvalidImageFile: "Invalid image file",
  ImageUploadFailed: "Failed to upload image on server. Please contact the developer.",
  ImagesUploadFailed: "Failed to upload multiple images on server. Please contact the developer.",
  ImageDeleteFailed: "Failed to delete image from server. Please contact the developer.",
  ImagesDeleteFailed: "Failed to delete multiple images from server. Please contact the developer.",
  ImageRenameFailed: "Failed to rename image on server. Please contact the developer.",
  ImageFolderDeleteFailed:
    "Failed to delete image folder from server. Please contact the developer.",

  DatabaseConnectionFailed: "Failed to connect to database. Please contact the developer.",
  InternalServerError: "Internal server error. Please contact the developer.",

  InvalidCredentials: "Invalid credentials",
  PasswordsDoNotMatch: "Passwords do not match",

  FormParseFailed: "Failed to parse form data",

  InvalidItem: "Invalid item",
  InvalidEmail: "Invalid email",
  InvalidName: "Invalid name",
  InvalidPrice: "Invalid price",
  InvalidAmount: "Invalid amount",
  InvalidDescription: "Invalid description",

  Forbidden: "Forbidden. Please contact the developer.",
  NotFound: "Not found. Please contact the developer.",
  MethodNotAllowed: "HTTP method not allowed. Please contact the developer.",
  Conflict: "Conflict. Please contact the developer.",
  TooManyRequests: "Too many requests. Please contact the developer.",
  BadGateway: "Bad gateway. Please contact the developer.",
  ServiceUnavailable: "Service unavailable. Please contact the developer.",
  GatewayTimeout: "Gateway timeout. Please contact the developer.",
  SomethingWentWrong: "Something went wrong. Please contact the developer.",
};

export const SuccessMessages = {
  UserCreated: "User created!",
  UserUpdated: "User updated!",
  UserDeleted: "User deleted!",
  UserLoggedIn: "User logged in!",
  UserLoggedOut: "User logged out!",
  UserSignedUp: "User signed up!",
  UserSignedIn: "User signed in!",
  UserSignedOut: "User signed out!",
  UserPasswordChanged: "User password changed!",
  UserPasswordReset: "User password reset!",
  UserPasswordResetSent: "User password reset sent!",
  UserEmailChanged: "User email changed!",
  UserDataLoaded: "User data loaded!",

  ItemAdded: "Item added!",
  ItemEdited: "Item edited!",
  ItemDeleted: "Item deleted!",
  PreferredListTypeSaved: "Preferred list type saved!",

  ItemImageDeleted: "Item image deleted!",
  UserImageDeleted: "User image deleted!",
  ItemImageUploaded: "Item image uploaded!",
  UserImageUploaded: "User image uploaded",
};

export const PendingMessages = {
  Saving: "Saving, please wait...",
  Loading: "Loading, please wait...",
  Launching: "Launching, please wait...",

  DeletingUser: "Deleting user, please wait...",
  DeletingItem: "Deleting item, please wait...",
  SavingItem: "Saving item, please wait...",

  CreatingUser: "Creating user, please wait...",
  LoggingIn: "Signing in, please wait...",
  LoggingOut: "Signing out, please wait...",

  LoadingInventory: "Loading inventory, please wait...",
};
