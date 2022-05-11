import useFetchEnrolledClassrooms from "../../../hooks/useFetchEnrolledClassrooms";
import UserCurrentClassrooms from "./usercurrentclassroom";

const UserEnrolledClassroomList = () => {
  const { enrolledClassrooms, loading } = useFetchEnrolledClassrooms();

  return (
    <UserCurrentClassrooms
      classrooms={enrolledClassrooms}
      title={"Enrolled Classrooms"}
      loading={loading}
      taught={false}
    />
  );
};

export default UserEnrolledClassroomList;
