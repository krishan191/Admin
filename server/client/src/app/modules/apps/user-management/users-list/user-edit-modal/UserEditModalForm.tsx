import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { isNotEmpty, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { initialUser, User } from "../core/_models";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { createUser, updateUser } from "../core/_requests";
import { useQueryResponse } from "../core/QueryResponseProvider";

type Props = {
  isUserLoading: boolean;
  user: User;
};

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Name is required"),
});

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();

  const [userForEdit, setUserForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    position: user.position || initialUser.position,
    name: user.name || initialUser.name,
    email: user.email || initialUser.email,
  });

  // console.log(userForEdit);

  const [previewImage, setPreviewImage] = useState<string>(
    user.avatar || "/default-avatar.png"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const userAvatarImg = toAbsoluteUrl(
    typeof userForEdit.avatar === "string"
      ? userForEdit.avatar
      : "/default-avatar.png"
  );

  // console.log("User Avatar:", user.avatar);
  // console.log("Preview Image:", previewImage);
  // console.log("User Avatar Image:", userAvatarImg);

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values: any, { setSubmitting }: any) => {
      setSubmitting(true);
      try {
        if (isNotEmpty(values._id)) {
          // console.log("Updating user with ID:", values._id);
          console.log(values);

          await updateUser(values);
          alert("User updated successfully");
        } else {
          console.log(values);

          // console.log("Creating new user");
          await createUser(values);
          alert("User created successfully");
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // console.log(file);
      setSelectedFile(file);
      // Generate a temporary URL for preview
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL); //returns type blob

      setPreviewImage(fileURL);
      formik.setFieldValue("avatar", file);
    }
  };

  // Handle remove image action
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage("/default-avatar.png");
    formik.setFieldValue("avatar", null);
  };

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div
          className="d-flex flex-column scroll-y me-n7 pe-7"
          id="kt_modal_add_user_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_user_header"
          data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
          data-kt-scroll-offset="300px"
        >
          <div className="fv-row mb-7">
            <label className="d-block fw-bold fs-6 mb-5">Avatar</label>
            <div
              className="image-input image-input-outline"
              data-kt-image-input="true"
            >
              <div
                className="image-input-wrapper w-125px h-125px"
                style={{
                  backgroundImage: `url('${previewImage || userAvatarImg}')`,
                }}
              ></div>

              <label
                className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                data-kt-image-input-action="change"
                data-bs-toggle="tooltip"
                title="Change avatar"
              >
                <i className="bi bi-pencil-fill fs-7"></i>

                <input
                  type="file"
                  name="avatar"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                />
                <input type="hidden" name="avatar_remove" />
              </label>
              {previewImage && (
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove avatar"
                  onClick={handleRemoveImage}
                >
                  <i className="bi bi-x fs-2"></i>
                </span>
              )}
            </div>
            <div className="form-text">Allowed file types: png, jpg, jpeg.</div>
          </div>

          {/* full Name */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Full Name</label>

            <input
              placeholder="Full name"
              {...formik.getFieldProps("name")}
              type="text"
              name="name"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.name && formik.errors.name },
                {
                  "is-valid": formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Email</label>

            <input
              placeholder="Email"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.email && formik.errors.email },
                {
                  "is-valid": formik.touched.email && !formik.errors.email,
                }
              )}
              type="email"
              name="email"
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="mb-7">
            <label className="required fw-bold fs-6 mb-5">Role</label>

            <div className="d-flex fv-row">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="Administrator"
                  id="kt_modal_update_role_option_0"
                  checked={formik.values.role === "Administrator"}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_0"
                >
                  <div className="fw-bolder text-gray-800">Administrator</div>
                  <div className="text-gray-600">
                    Best for business owners and company administrators
                  </div>
                </label>
              </div>
            </div>

            <div className="separator separator-dashed my-5"></div>

            <div className="d-flex fv-row">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="Developer"
                  id="kt_modal_update_role_option_1"
                  checked={formik.values.role === "Developer"}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_1"
                >
                  <div className="fw-bolder text-gray-800">Developer</div>
                  <div className="text-gray-600">
                    Best for developers or people primarily using the API
                  </div>
                </label>
              </div>
            </div>

            <div className="separator separator-dashed my-5"></div>

            <div className="d-flex fv-row">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="Analyst"
                  id="kt_modal_update_role_option_2"
                  checked={formik.values.role === "Analyst"}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_2"
                >
                  <div className="fw-bolder text-gray-800">Analyst</div>
                  <div className="text-gray-600">
                    Best for people who need full access to analytics data, but
                    don't need to update business settings
                  </div>
                </label>
              </div>
            </div>

            <div className="separator separator-dashed my-5"></div>

            <div className="d-flex fv-row">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="Support"
                  id="kt_modal_update_role_option_3"
                  checked={formik.values.role === "Support"}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_3"
                >
                  <div className="fw-bolder text-gray-800">Support</div>
                  <div className="text-gray-600">
                    Best for employees who regularly refund payments and respond
                    to disputes
                  </div>
                </label>
              </div>
            </div>

            <div className="separator separator-dashed my-5"></div>

            <div className="d-flex fv-row">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  id="kt_modal_update_role_option_4"
                  value="Trial"
                  checked={formik.values.role === "Trial"}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_4"
                >
                  <div className="fw-bolder text-gray-800">Trial</div>
                  <div className="text-gray-600">
                    Best for people who need to preview content data, but don't
                    need to make any updates
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => cancel()}
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isUserLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  );
};

export { UserEditModalForm };
