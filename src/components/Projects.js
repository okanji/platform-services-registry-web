import React, { useContext } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import StickyTable from "./common/Table";
import Chip from "@mui/material/Chip";
import AdminContext from "../context/admin";
import { useKeycloak } from "@react-keycloak/web";
import NavTabs from "../pages/NavTabs";

const columns = [
  { id: "name", label: "Name", minWidth: 0 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "ministry", label: "Ministry", minWidth: 0 },
  { id: "cluster", label: "Cluster", minWidth: 0 },
  { id: "projectOwner", label: "Project Owner", minWidth: 0 },
  { id: "technicalLeads", label: "Technical Leads", minWidth: 0 },
  { id: "licencePlate", label: "License Place", minWidth: 0 },
];

export const PROJECT_FIELDS = gql`
  fragment ProjectFields on PrivateCloudProject {
    id
    name
    description
    cluster
    ministry
    licencePlate
    projectOwner {
      firstName
      lastName
    }
    technicalLeads {
      firstName
      lastName
    }
  }
`;

const USER_PROJECTS = gql`
  ${PROJECT_FIELDS}
  query UserProjects {
    userPrivateCloudProjects {
      ...ProjectFields
    }
  }
`;

const ALL_PROJECTS = gql`
  ${PROJECT_FIELDS}
  query PrivateCloudProjects {
    privateCloudProjects {
      ...ProjectFields
    }
  }
`;

export default function Projects() {
  const { admin } = useContext(AdminContext);
  const { keycloak } = useKeycloak();

  const skip = !keycloak.hasResourceRole("admin", "registry-api");

  const [loadUserProjects, userProjects] = useLazyQuery(USER_PROJECTS);
  const allProjects = useQuery(ALL_PROJECTS, { skip });

  if (!admin && !userProjects.called) {
    loadUserProjects();
    return "Loading...";
  }

  const errors = userProjects.error || allProjects.error;
  const loading = userProjects.loading || allProjects.loading;

  if (loading) return "Loading...";
  if (errors) return `Error! ${errors.message}`;

  const privateCloudProjects = admin
    ? allProjects.data?.privateCloudProjects
    : userProjects.data?.userPrivateCloudProjects;

  const rows = privateCloudProjects.map(
    ({
      name,
      description,
      projectOwner,
      technicalLeads,
      ministry,
      cluster,
      licencePlate,
    }) => ({
      name,
      description,
      ministry,
      cluster,
      licencePlate,
      projectOwner: `${projectOwner.firstName} ${projectOwner.lastName}`,
      technicalLeads: (
        <div>
          {technicalLeads.map(({ firstName, lastName }, i) => (
            <div key={i}>{`${firstName} ${lastName}`}</div>
          ))}
        </div>
      ),
    })
  );

  return (
    <div>
      <NavTabs/>
      <StickyTable
        title={"Private Cloud Projects"}
        columns={columns}
        rows={rows}
      />
      ;
    </div>
  );
}
