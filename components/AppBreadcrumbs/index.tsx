import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import { useRouter } from "next/router";
import useClassroom from "../../hooks/useClassroom";
import useProject from "../../hooks/useProject";

export type BreadcrumbsQuery = {
  classroomId: string | undefined;
  projectId: string | undefined;
};

export type Crumb = {
  name: string;
  href: string;
};

const AppBreadcrumbs = () => {
  const router = useRouter();
  const { classroomId, projectId } = router.query as BreadcrumbsQuery;

  const classroom = useClassroom({
    classroomId: classroomId!,
    options: { enabled: !!classroomId },
  });

  const project = useProject({
    projectId: projectId!,
    options: { enabled: !!projectId },
  });

  const crumbs: { [id: string]: Crumb } = {};

  if (classroomId && classroom?.data?.title) {
    crumbs["app"] = { name: "Home", href: "/app" };

    crumbs["classroom"] = {
      name: classroom.data.title,
      href: `/app/classroom/${classroomId}`,
    };
  }

  if (classroomId && projectId && project?.data?.title) {
    crumbs["project"] = {
      name: project.data.title,
      href: `/app/classroom/${classroomId}/projects/${projectId}`,
    };
  }

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        {Object.values(crumbs).map(({ name, href }) => (
          <MuiLink underline="hover" color="white" href={href}>
            {name}
          </MuiLink>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default AppBreadcrumbs;
