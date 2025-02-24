import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import MetaDataInput from "../../components/forms/MetaDataInput";
import ClusterInput from "../../components/forms/ClusterInput";
import MinistryInput from "../../components/forms/MinistryInput";
import NavToolbar from "../../components/NavToolbar";
import {
  projectInitialValues as initialValues,
  replaceNullsWithEmptyString
} from "../../components/common/FormHelpers";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import Container from "../../components/common/Container";
import Users from "../../components/forms/Users";
import Divider from "@mui/material/Divider";
import Quotas from "../../components/forms/Quotas";
import Namespaces from "../../components/Namespaces";
import TitleTypography from "../../components/common/TitleTypography";
import { Typography } from "@mui/material";

const USER_REQUEST = gql`
  query UserPrivateCloudRequestById($requestId: ID!) {
    userPrivateCloudRequestById(requestId: $requestId) {
      id
      createdBy {
        firstName
        lastName
      }
      decisionMaker {
        firstName
        lastName
        id
      }
      type
      decisionStatus
      humanComment
      active
      created
      decisionDate
      project {
        name
        productionQuota {
          cpu
          memory
          storage
        }
        testQuota {
          cpu
          memory
          storage
        }
        developmentQuota {
          cpu
          memory
          storage
        }
        toolsQuota {
          cpu
          memory
          storage
        }
      }
      requestedProject {
        id
        name
        licencePlate
        description
        status
        projectOwner {
          email
          firstName
          lastName
          ministry
        }
        primaryTechnicalLead {
          email
          firstName
          lastName
          ministry
        }
        secondaryTechnicalLead {
          email
          firstName
          lastName
          ministry
        }
        ministry
        cluster
        commonComponents {
          addressAndGeolocation
          workflowManagement
          formDesignAndSubmission
          identityManagement
          paymentServices
          documentManagement
          endUserNotificationAndSubscription
          publishing
          businessIntelligence
          noServices
          other
        }
        productionQuota {
          cpu
          memory
          storage
        }
        testQuota {
          cpu
          memory
          storage
        }
        developmentQuota {
          cpu
          memory
          storage
        }
        toolsQuota {
          cpu
          memory
          storage
        }
      }
    }
  }
`;

export default function UserRequest() {
  const { id } = useParams();
  const [humanCommentText, setHumanCommentText] = useState(null);

  const { data, loading, error } = useQuery(USER_REQUEST, {
    variables: { requestId: id }
  });

  const { project, requestedProject, ...request } =
    data?.userPrivateCloudRequestById || {};
  const formik = useFormik({
    initialValues
  });

  useEffect(() => {
    if (requestedProject) {
      // Form values cannon be null (uncontrolled input error), so replace nulls with empty strings
      formik.setValues(replaceNullsWithEmptyString(requestedProject));
    }
  }, [requestedProject]);

  useEffect(() => {
    if (request) {
      setHumanCommentText(request.humanComment);
    }
  }, [request]);

  const name =
    request?.type === "CREATE" ? requestedProject?.name : project?.name;
  const isDisabled = !requestedProject || request?.decisionStatus !== "PENDING";

  return (
    <div>
      <NavToolbar
        label={"requests"}
        path={"user/dashboard/requests"}
        title={name}
      ></NavToolbar>
      <Container>
        <MetaDataInput formik={formik} isDisabled={true} />
        <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />
        <div>
          <div style={{ display: "flex" }}>
            <MinistryInput formik={formik} isDisabled={true} />
            <ClusterInput formik={formik} isDisabled={true} />
          </div>
          <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />
          {request?.type !== "CREATE" ? (
            <div>
              <Namespaces
                cluster={
                  data?.userPrivateCloudRequestById?.requestedProject?.cluster
                }
                licencePlate={
                  data?.userPrivateCloudRequestById?.requestedProject
                    ?.licencePlate
                }
              />
              <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />
            </div>
          ) : null}
          <Users formik={formik} isDisabled={true} />
          <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />
          <Quotas
            formik={formik}
            isDisabled={isDisabled}
            currentProjectQuota={data?.userPrivateCloudRequestById?.project}
          />
          {humanCommentText && [
            <Divider variant="middle" sx={{ mt: 1, mb: 5 }} />,
            <TitleTypography> Reviewer’s comments</TitleTypography>,
            <Typography sx={{ mb: 6, maxWidth: 600 }} color="text.primary">
              {humanCommentText}
            </Typography>
          ]}
        </div>
      </Container>
    </div>
  );
}
