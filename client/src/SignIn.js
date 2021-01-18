import {
  Form,
  FormLayout,
  TextField,
  Page,
  Card,
  Button,
  InlineError,
} from "@shopify/polaris";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import AuthService from "./services/AuthService";

function SignIn({ setToken }) {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailErrorMsg, setEmailErrorMsg] = useState();
  const [passwordErrorMsg, setPasswordErrorMsg] = useState();
  const [signInErrorMsg, setSignInErrorMsg] = useState();

  const signInUser = (email, password) => {
    AuthService.signIn(email, password).then(
      (response) => {
        if (response.error) {
          setSignInErrorMsg(response.error);
        }
        else {
          history.push("/gallery");
          window.location.reload();
        }
      },
      (error) => {
        setSignInErrorMsg(error.message);
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // email field empty
    if (!email) {
      isValid = false;
      setEmailErrorMsg("You must enter your email");
    }

    // password field empty
    if (!password) {
      isValid = false;
      setPasswordErrorMsg("You must enter your password");
    }

    if (isValid) {
      signInUser(email, password);
    }
  };

  return (
    <Page
      title="Sign In"
      primaryAction={{
        content: "Register",
        onAction: () => history.push("/register"),
      }}
      narrowWidth
    >
      <Card sectioned>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              value={email}
              label="Email"
              type="email"
              inputMode="email"
              error={emailErrorMsg}
              onChange={(value) => setEmail(value)}
              required
            />
            <TextField
              value={password}
              label="Password"
              type="password"
              error={passwordErrorMsg}
              onChange={(value) => setPassword(value)}
              required
            />
            <Button primary submit>
              Sign In
            </Button>
            {signInErrorMsg && <InlineError message={signInErrorMsg}></InlineError>}
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}

export default SignIn;

SignIn.propTypes = {
  setToken: PropTypes.func.isRequired,
};
