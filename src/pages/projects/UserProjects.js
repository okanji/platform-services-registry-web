import React from "react";
import { useQuery, gql } from "@apollo/client";
import { columns, projectsToRows } from "./helpers";
import StickyTable from "../../components/common/Table";
import { InfoAlert, ErrorAlert } from "../../components/common/Alert";

const USER_PROJECTS = gql`
  query UserProjects {
    userPrivateCloudProjects {
      id
      name
      description
      cluster
      ministry
      licencePlate
      projectOwner {
        firstName
        lastName
        githubId
      }
      primaryTechnicalLead {
        firstName
        lastName
        githubId
      }
      secondaryTechnicalLead {
        firstName
        lastName
        githubId
      }
    }
  }
`;

export default function Projects() {
  const { loading, error, data } = useQuery(USER_PROJECTS);

  if (error && error.message === "Not a user") {
    return (
      <InfoAlert
        title="You don't have any products yet"
        message={
          <p>
            You will see products here once you are assigned as product owner or
            technical lead. Use the <strong>create</strong> button to create
            your own product.
          </p>
        }
      />
    );
  } else if (error) {
    return <ErrorAlert error={error} />;
  }

  return !loading ? (
    <StickyTable
      onClickPath={"/private-cloud/user/project/"}
      columns={columns}
      rows={data.userPrivateCloudProjects.map(projectsToRows)}
      title="Projects"
      loading={loading}
    />
  ) : null;
}
