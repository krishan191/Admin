import { useQuery } from "@tanstack/react-query";
import { UserEditModalForm } from "./UserEditModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";
import { getUserById } from "../core/_requests";

const UserEditModalFormWrapper = () => {
  const { itemIdForUpdate } = useListView();
  // console.log(itemIdForUpdate);

  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  // console.log(enabledQuery);

  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
    queryFn: () => getUserById(itemIdForUpdate),
    enabled: enabledQuery,
  });

  // console.log(`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`);
  // console.log("value is", !isLoading && !error && user);

  if (!itemIdForUpdate) {
    // console.log("hello hoi");

    return (
      <UserEditModalForm isUserLoading={isLoading} user={{ _id: undefined }} />
    );
  }

  if (!isLoading && !error && user) {
    // console.log("hello");

    return <UserEditModalForm isUserLoading={isLoading} user={user} />;
  }

  return null;
};

export { UserEditModalFormWrapper };
