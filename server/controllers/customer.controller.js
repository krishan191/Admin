import CustomerModel from "../models/customer.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      items_per_page = 10,
      search = "",
      sort = "name",
    } = req.query;

    const pageNumber = parseInt(page);
    const limit = parseInt(items_per_page);
    const skip = (pageNumber - 1) * limit;

    // Build search query
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    // Fetch customers with pagination and sorting
    const customers = await CustomerModel.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await CustomerModel.countDocuments(query);
    const last_page = Math.ceil(total / limit);

    res.status(200).json({
      data: customers,
      payload: {
        pagination: {
          page: pageNumber,
          first_page_url: `/?page=1`,
          from: skip + 1,
          last_page,
          links: [
            {
              url: pageNumber > 1 ? `/?page=${pageNumber - 1}` : null,
              label: "&laquo; Previous",
              active: false,
              page: pageNumber > 1 ? pageNumber - 1 : null,
            },
            ...Array.from({ length: last_page }, (_, index) => ({
              url: `/?page=${index + 1}`,
              label: (index + 1).toString(),
              active: index + 1 === pageNumber,
              page: index + 1,
            })),
            {
              url: pageNumber < last_page ? `/?page=${pageNumber + 1}` : null,
              label: "Next &raquo;",
              active: false,
              page: pageNumber < last_page ? pageNumber + 1 : null,
            },
          ],
          next_page_url:
            pageNumber < last_page ? `/?page=${pageNumber + 1}` : null,
          items_per_page: limit,
          prev_page_url: pageNumber > 1 ? `/?page=${pageNumber - 1}` : null,
          to: skip + customers.length,
          total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Get a single customer by ID.

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customers = await CustomerModel.findById(id);

    if (!customers) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ data: customers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error });
  }
};

// Create a new customer.

export const createCustomer = async (req, res) => {
  try {
    const { name, email, position, role } = req.body;

    // Check if the customer already exists
    const existingCustomer = await CustomerModel.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists" });
    }

    let avatarUrl = "";

    // If an image file is uploaded, upload to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "customer-avatars",
      });
      avatarUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // Remove temporary file
    }

    // Create new customer
    const customer = new CustomerModel({
      name,
      email,
      position,
      role,
      avatar: avatarUrl,
    });
    await customer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.error("Error creating customer backend:", error);
    res
      .status(500)
      .json({ message: "Error creating customer in backend", error });
  }
};

//  Update an existing customer by ID.

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, position, role, avatar } = req.body;

    let avatarUrl = avatar; // Default to existing avatar

    // If a new file is uploaded, upload it to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "customer-avatars",
      });
      avatarUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // Remove temporary file
    }

    // Update customer details
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { name, email, position, role, avatar: avatarUrl },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer", error });
  }
};

//  Delete a customer by ID.

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCustomer = await CustomerModel.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

// Delete multiple customers by their IDs.

export const deleteSelectedCustomers = async (req, res) => {
  try {
    const { ids } = req.body; // Array of customer IDs

    await CustomerModel.deleteMany({ _id: { $in: ids } });

    res
      .status(200)
      .json({ message: "Selected customers deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customers", error });
  }
};
