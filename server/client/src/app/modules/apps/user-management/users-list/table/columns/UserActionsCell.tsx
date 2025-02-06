import { FC, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { deleteUser } from "../../core/_requests";

type Props = {
  id: ID;
};

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate } = useListView();
  const { query } = useQueryResponse();
  const queryClient = useQueryClient();

  // Log the initial props and context values
  // console.log("UserActionsCell: Initial props and context", {
  //   id,
  //   query,
  //   setItemIdForUpdate,
  // });

  useEffect(() => {
    // console.log("UserActionsCell: useEffect - Reinitializing MenuComponent");
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    // console.log(
    //   "UserActionsCell: openEditModal - Opening edit modal for ID:",
    //   id
    // );
    setItemIdForUpdate(id);
    // console.log("UserActionsCell: openEditModal - itemIdForUpdate set to:", id);
  };

  const deleteItem = useMutation({
    mutationFn: () => {
      // console.log("UserActionsCell: deleteItem - Deleting user with ID:", id);
      alert("user deleted successfully");
      return deleteUser(id);
    },
    onSuccess: () => {
      // console.log("UserActionsCell: deleteItem - User deleted successfully");
      // Invalidate the query to refetch the user list
      const queryKey = `${QUERIES.USERS_LIST}-${query}`;
      // console.log(
      //   "UserActionsCell: deleteItem - Invalidating query with key:",
      //   queryKey
      // );
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      // console.log("hi");
      console.error(
        "UserActionsCell: deleteItem - Error deleting user:",
        error
      );
    },
  });

  return (
    <>
      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Actions
        <KTIcon iconName="down" className="fs-5 m-0" />
      </a>
      {/* begin::Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        {/* begin::Menu item */}
        <div className="menu-item px-3">
          <a className="menu-link px-3" onClick={openEditModal}>
            Edit
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            onClick={async () => {
              console.log("UserActionsCell: Delete button clicked");
              try {
                await deleteItem.mutateAsync();
                // console.log(
                //   "UserActionsCell: Delete mutation completed successfully"
                // );
              } catch (error) {
                console.error(
                  "UserActionsCell: Delete mutation failed:",
                  error
                );
              }
            }}
          >
            Delete
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  );
};

export { UserActionsCell };
