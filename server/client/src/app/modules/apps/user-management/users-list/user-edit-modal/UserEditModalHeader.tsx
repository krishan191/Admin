import { KTIcon } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";

const UserEditModalHeader = () => {
  const { setItemIdForUpdate } = useListView();

  return (
    <div className="modal-header">
      <h2 className="fw-bolder">Add User</h2>
      <div
        className="btn btn-icon btn-sm btn-active-icon-primary"
        data-kt-users-modal-action="close"
        onClick={() => setItemIdForUpdate(undefined)}
        style={{ cursor: "pointer" }}
      >
        <KTIcon iconName="cross" className="fs-1" />
      </div>
    </div>
  );
};

export { UserEditModalHeader };
