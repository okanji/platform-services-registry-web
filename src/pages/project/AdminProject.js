import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import MetaDataInput from "../../components/MetaDataInput";
import ClusterInput from "../../components/ClusterInput";
import QuotaInput from "../../components/QuotaInput";
import NavToolbar from "../../components/NavToolbar";
import {
  userProjectToFormData,
  formDataToUserProject,
  projectFormSchema as schema
} from "../../components/common/FormHelpers";
import CommonComponents from "../../components/CommonComponents";
import Typography from "@mui/material/Typography";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, IconButton } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import StyledLink from "../../components/common/StyledLink";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StyledForm from "../../components/common/StyledForm";

const PROJECT = gql`
  query Query($projectId: ID!) {
    privateCloudProject(projectId: $projectId) {
      id
      name
      description
      activeEditRequest {
        id
        active
      }
      projectOwner {
        email
        githubId
      }
      primaryTechnicalLead {
        email
        githubId
      }
      secondaryTechnicalLead {
        email
        githubId
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
        other
      }
      productionQuota {
        cpu {
          requests
          limits
        }
        memory {
          requests
          limits
        }
        storage {
          file
        }
        snapshot {
          count
        }
      }
      testQuota {
        cpu {
          limits
          requests
        }
        memory {
          requests
          limits
        }
        storage {
          file
        }
        snapshot {
          count
        }
      }
      developmentQuota {
        cpu {
          requests
          limits
        }
        memory {
          requests
          limits
        }
        storage {
          file
        }
        snapshot {
          count
        }
      }
      toolsQuota {
        cpu {
          requests
          limits
        }
        memory {
          requests
          limits
        }
        storage {
          file
        }
        snapshot {
          count
        }
      }
    }
  }
`;

const UPDATE_USER_PROJECT = gql`
  mutation Mutation(
    $projectId: ID!
    $metaData: EditProjectMetaDataInput
    $commonComponents: CommonComponentsInput
    $productionQuota: QuotaInput
    $developmentQuota: QuotaInput
    $testQuota: QuotaInput
    $toolsQuota: QuotaInput
  ) {
    privateCloudProjectEditRequest(
      projectId: $projectId
      metaData: $metaData
      commonComponents: $commonComponents
      productionQuota: $productionQuota
      developmentQuota: $developmentQuota
      testQuota: $testQuota
      toolsQuota: $toolsQuota
    ) {
      id
      active
    }
  }
`;

const DELETE_USER_PROJECT = gql`
  mutation Mutation($projectId: ID!) {
    privateCloudProjectDeleteRequest(projectId: $projectId) {
      id
    }
  }
`;

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, dirtyFields, errors }
  } = useForm({ resolver: yupResolver(schema) });

  const {
    loading: projectLoading,
    data: projectData,
    error: projectError,
    refetch
  } = useQuery(PROJECT, {
    fetchPolicy: "network-only",
    variables: { projectId: id },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const project = data.privateCloudProject;
      const formData = userProjectToFormData(project);
      reset(formData);
    }
  });

  const [
    createPrivateCloudProjectEditRequest,
    {
      data: editProjectData,
      loading: editProjectLoading,
      error: editProjectError
    }
  ] = useMutation(UPDATE_USER_PROJECT, {
    refetchQueries: ["PrivateCloudActiveRequests"]
  });

  const [
    deletePrivateCloudProjectRequest,
    {
      data: deleteProjectData,
      loading: deleteProjectLoading,
      error: deleteProjectError
    }
  ] = useMutation(DELETE_USER_PROJECT, {
    refetchQueries: ["PrivateCloudActiveRequests"]
  });

  const privateCloudProject = projectData?.privateCloudProject;

  const onSubmit = (data) => {
    const userProject = formDataToUserProject(data, dirtyFields);

    createPrivateCloudProjectEditRequest({
      variables: { projectId: id, ...userProject },
      onCompleted: () => {
        navigate(-1);
      }
    });
  };

  const onDeleteSubmit = () => {
    deletePrivateCloudProjectRequest({
      variables: { projectId: id },
      onCompleted: () => {
        navigate(-1);
      }
    });
  };

  if (projectError || editProjectError || deleteProjectError) {
    return `Error! ${projectError} ${editProjectError}`;
  }

  return (
    <div>
      <FormProvider
        {...{
          control,
          errors,
          setValue,
          watch,
          isDirty,
          isDisabled: privateCloudProject?.activeEditRequest?.active
        }}
      >
        <NavToolbar path={"project"} title={privateCloudProject?.name}>
          <IconButton
            sx={{ mr: 2 }}
            disabled={!isDirty}
            onClick={() => {
              refetch({ projectId: id });
            }}
            aria-label="delete"
          >
            <RestartAltIcon />
          </IconButton>
          <Button
            sx={{ mr: 1 }}
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
            variant="outlined"
          >
            SUBMIT EDIT REQUEST
          </Button>
          <IconButton
            sx={{ mr: 1 }}
            onClick={handleSubmit(onDeleteSubmit)}
            aria-label="delete"
          >
            <DeleteForeverIcon />
          </IconButton>
        </NavToolbar>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          {privateCloudProject?.activeEditRequest?.active && (
            <Typography
              variant="body"
              sx={{ mb: 0, ml: 3, color: "rgba(0, 0, 0, 0.6)" }}
            >
              This project cannot be edited as it has an{" "}
              <StyledLink
                to={`/private-cloud/user/request/${privateCloudProject?.activeEditRequest?.id}`}
              >
                <i>active request</i>
              </StyledLink>
            </Typography>
          )}
        </div>
        {editProjectLoading ? (
          <LoadingSpinner />
        ) : (
          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <MetaDataInput />
            <div style={{ marginLeft: 70 }}>
              <ClusterInput />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <QuotaInput nameSpace={"production"} />
                  <QuotaInput nameSpace={"test"} />
                </div>
                <div>
                  <QuotaInput nameSpace={"tools"} />
                  <QuotaInput nameSpace={"development"} />
                </div>
              </div>
              <CommonComponents />
            </div>
          </StyledForm>
        )}
      </FormProvider>
    </div>
  );
}
