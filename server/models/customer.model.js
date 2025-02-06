import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  avatar: {
    type: String,
    default: null, // Default to null if no avatar is provided
  },
  initials: {
    label: {
      type: String,
      default: "", // Default to empty string, will be dynamically set
    },
    state: {
      type: String,
      default: "", // Default to empty string, will be dynamically set
    },
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  position: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    // required: true,
  },
});

// Middleware to dynamically set initials if avatar is not provided
CustomerSchema.pre("save", function (next) {
  if (!this.avatar) {
    // Set the label to the first letter of the name
    this.initials.label = this.name ? this.name.charAt(0).toUpperCase() : "";

    // Dynamically set the state based on some logic (e.g., random or based on name length)
    const states = ["danger", "success", "warning", "info"]; // Example states
    const randomState = states[Math.floor(Math.random() * states.length)]; // Randomly pick a state
    this.initials.state = randomState;
  }
  next();
});
const CustomerModel = mongoose.model("Customer", CustomerSchema);

export default CustomerModel;
