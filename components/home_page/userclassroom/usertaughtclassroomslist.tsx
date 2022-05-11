import useFetchTaughtClassrooms from "../../../hooks/useFetchTaughtClassrooms";
import UserCurrentClassrooms from "./usercurrentclassroom";

const UserTaughtClassroomList = () => {
  const { taughtClassrooms, loading } = useFetchTaughtClassrooms();
  return (
    <UserCurrentClassrooms
      classrooms={taughtClassrooms}
      title={"Your Created Classes"}
      loading={loading}
    />
  );
};

export default UserTaughtClassroomList;
