import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router-dom";
import { Box, Text, Flex } from "rebass";
import { Label, Checkbox } from "@rebass/forms";
import styled from "@emotion/styled";

export const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #fcba19;
  color: #003366;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  border-radius: 2px;
  cursor: pointer;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
`;

const titleForAuthenticationState = (keycloak) => {
  if (keycloak.authenticated) {
    return "Logout";
  }

  return "Login";
};

const actionForCurrentState = (keycloak) => {
  if (keycloak.authenticated) {
    return () => keycloak.logout();
  }

  // TODO: update this once a better access control is in place
  // where we check if users are part of our GitHub organization
  return () => keycloak.login();
};

const Button = (props) => {
  const { keycloak } = useKeycloak();

  return (
    <StyledButton onClick={actionForCurrentState(keycloak)}>
      LOGIN
      {props.children}
    </StyledButton>
  );
};

Button.defaultProps = {
  children: null,
  onClick: () => {
    // this is intentional (required by Sonarcloud)
  }
};

const StyledExternalLink = styled.a`
  color: #003366;
  font-weight: 600;
  :visited: {
    color: #003366;
  }
`;

const StyledacknowledgeMessage = styled(Label)`
  ${({ active }) => active && ` color: red;`}
`;

const StyledList = styled.ul`
  margin-top: 10px;
  padding-left: 15px;
`;

const Login = () => {
  const { keycloak } = useKeycloak();
  const [isAttendedSession, SetIsAttendedSession] = useState(false);
  const [showWarningMessage, setShowWarningMessage] = useState(false);

  return (
    <Flex
      flexDirection="column"
      sx={{
        lineHeight: 2,
        maxHeight: 100,
        marginTop: 30,
        marginLeft: 50
      }}
    >
      <Box mb={3}>
        <Text as="h1" mb={3}>
          Welcome to BC Gov's Platform as a Service(PaaS) product Registry
        </Text>
      </Box>
      <Box mb={3}>
        <Text as="h2" mb={2}>
          Make changes to an existing product
        </Text>
        <Text mb={2}>
          For existing application's hosted on OpenShift 4 Platform. You can
          update/change all product details and request product resource quota
          increases and downgrades (including CPU/RAM/Storage.)
        </Text>
        <StyledButton onClick={() => keycloak.login()}>Login</StyledButton>
      </Box>
      <Box mb={3}>
        <Text as="h2" mb={2}>
          Register a new product
        </Text>
        <Text mb={2}>
          Use this website if you are a Product Owner for a new cloud-native
          application and are interested in hosting the app on the OpenShift 4
          Platform. You can learn about the BCGov's PaaS/OpenShift 4 Platform
          Service{" "}
          <StyledExternalLink
            rel="noopener noreferrer"
            href="https://developer.gov.bc.ca/topic/featured/Service-Overview-for-BC-Government-Private-Cloud-as-a-ServiceOpenshift-4-Platform"
            target="_blank"
          >
            here
          </StyledExternalLink>
        </Text>
      </Box>
      <Box mb={3}>
        <Text as="h3" mb={2}>
          Before you start:
        </Text>
        <Text mb={2}>
          This website is for teams who've attended an onboarding session with
          the platform team (if you currently host an application on OpenShift,
          you’ve done this already.) If you haven’t attended an onboarding
          session, please contact the Platform Director(
          <StyledExternalLink
            rel="noopener noreferrer"
            href="mailto:faisal.hamood@gov.bc.ca"
            target="_blank"
          >
            faisal.hamood@gov.bc.ca
          </StyledExternalLink>
          ) to book an onboarding session.
        </Text>
        <StyledacknowledgeMessage pb={2} active={showWarningMessage}>
          <Checkbox
            name="attendedOnboardingSession"
            type="checkbox"
            onChange={() => {
              SetIsAttendedSession(!isAttendedSession);
            }}
          />
          <Text as="h3" fontSize="16px" my={0} lineHeight="normal" ml={2}>
            I confirm I’ve attended an onboarding session.
          </Text>
        </StyledacknowledgeMessage>
        <StyledButton
          onClick={() => {
            if (isAttendedSession) {
              keycloak.login();
              return;
            }
            setShowWarningMessage(true);
          }}
        >
          REGISTER A NEW PRODUCT (log in with BC IDIR)
        </StyledButton>
        {showWarningMessage && (
          <Text as="p" color="red">
            Please confirm above checkbox before continuing.
          </Text>
        )}
      </Box>
      <Box mb={3}>
        <Text as="h3">What you will need</Text>
        <StyledList>
          <Text as="li">
            A BC IDIR (you'll be asked to log in with your IDIR to get to the
            registry)
          </Text>
          <Text as="li">A descriptive product name (no acronyms)</Text>
          <Text as="li">
            Contact details and Github IDs for a product owner and up to 2
            technical leads
          </Text>
          <Text as="li">
            An idea of which common components you will use (see common
            components list)
          </Text>
        </StyledList>
      </Box>
    </Flex>
  );
};

export default Login;
