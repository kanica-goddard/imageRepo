import {
  Form,
  FormLayout,
  TextField,
  Page,
  Card,
  Button,
} from "@shopify/polaris";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AuthService from "./services/AuthService";

function Register() {
  const history = useHistory();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [firstNameErrorMsg, setFirstNameErrorMsg] = useState();
  const [lastNameErrorMsg, setLastNameErrorMsg] = useState();
  const [emailErrorMsg, setEmailErrorMsg] = useState();
  const [passwordErrorMsg, setPasswordErrorMsg] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // first name field empty
    if (user.firstName.length < 1) {
      isValid = false;
      setFirstNameErrorMsg("Please enter your first name.");
    }

    // last name field empty
    if (user.lastName.length < 1) {
      isValid = false;
      setLastNameErrorMsg("Please enter your last name.");
    }

    // email field empty
    if (user.email.length < 1) {
      isValid = false;
      setEmailErrorMsg("Please enter your email.");
    }

    // password field empty
    if (user.password.length < 6) {
      isValid = false;
      setPasswordErrorMsg("Please enter your password.");
    }

    if (isValid) {
      AuthService.register(user)
        .then(response => response.json())
        .then(
          (response) => {
            history.push("/");
          },
          (error) => {
            setEmailErrorMsg(error.message)
          });
    }
  };

  return (
    <Page
      title="Register"
      primaryAction={{
        content: "Sign In",
        onAction: () => history.push("/"),
      }}
      narrowWidth
    >
      <Card sectioned>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              value={user.firstName}
              label="First name"
              type="text"
              error={firstNameErrorMsg}
              onChange={(value) =>
                setUser((prevState) => ({ ...prevState, firstName: value }))
              }
              required
            />
            <TextField
              value={user.lastName}
              label="Last name"
              type="text"
              error={lastNameErrorMsg}
              onChange={(value) =>
                setUser((prevState) => ({ ...prevState, lastName: value }))
              }
              required
            />
            <TextField
              value={user.email}
              label="Email"
              type="email"
              inputMode="email"
              error={emailErrorMsg}
              onChange={(value) =>
                setUser((prevState) => ({ ...prevState, email: value }))
              }
              required
            />
            <TextField
              value={user.password}
              label="Password"
              type="password"
              error={passwordErrorMsg}
              onChange={(value) =>
                setUser((prevState) => ({ ...prevState, password: value }))
              }
              required
            />
            <Button primary submit>
              Register
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}

export default Register;
