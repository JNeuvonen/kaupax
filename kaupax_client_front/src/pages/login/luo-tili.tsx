import ContentSection from "@/components/ContentSection";
import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import { useLayout } from "@/context/layout";
import styleUtils from "@/styles/utils.module.css";
import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { FormikProvider, useFormik } from "formik";
import Link from "next/link";
import React from "react";
import * as Yup from "yup";
import styles from "./luo-tili.module.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { postReq } from "@/services/util";
import { createUserUrl } from "@/utils/endpoints";
import { useToast } from "@/context/toast";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/router";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import Spinner from "@/components/Spinner";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Salasanan tulee olla vähintään 8 merkkiä")
    .required("Salasana on pakollinen tieto"),

  passwordRepeat: Yup.string(),
  email: Yup.string()
    .email("Väärin kirjoitettu sähköpostiosoite")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Sähköpostiosoite on väärin kirjoitettu"
    )
    .required("Sähköpostiosoite on pakollinen tieto"),
});

export default function CreateAccount() {
  const layout = useLayout();

  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const [, setSecondPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const toast = useToast();
  const auth = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
      passwordRepeat: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const body = {
        email: values.email,
        password: values.password,
      };
      setIsLoading(true);

      const { status, res } = await postReq({
        url: createUserUrl,
        payload: body,
      });

      if (status === 200) {
        toast.toastProps.openToast({
          message: "Käyttäjätili luotu",
          severity: "success",
        });
        auth.writeAccesTokenToStorage(res.accessToken);
        auth.loginWithToken();
        router.push("/");
        setIsLoading(false);
      } else {
        if (res.message === "User already exists") {
          toast.toastProps.openToast({
            message: "Käyttäjätili on jo olemassa",
            severity: "error",
          });
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        } else {
          toast.toastProps.openToast({
            message: "Tapahtui virhe",
            severity: "error",
          });
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        }
      }
    },
  });

  const passwordRepeatOnError = () => {
    return (
      (formik.touched.passwordRepeat &&
        formik.errors.passwordRepeat !== undefined) ||
      !passwordsMatch
    );
  };

  React.useEffect(() => {
    layout.setLayoutMaxWidth("1200px");
  }, [layout]);

  if (isLoading) {
    return (
      <ContentSection>
        <div
          style={{
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      </ContentSection>
    );
  }

  return (
    <ContentSection>
      <div className={styles.loginContainer}>
        <div className={styles.contentContainer}>
          <h1 className={styles.mainHeader}>Luo käyttäjätili</h1>

          <FormikProvider value={formik}>
            <form
              onSubmit={formik.handleSubmit}
              className={styles.dropShadowContainer}
              style={{ marginTop: "24px" }}
            >
              <TextField
                label="Sähköposti"
                variant="outlined"
                id={"email"}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={
                  formik.touched.email && formik.errors.email !== undefined
                    ? true
                    : false
                }
                helperText={
                  formik.touched.email && formik.errors.email !== undefined
                    ? formik.errors.email
                    : ""
                }
              />
              <TextField
                id="password"
                label="Salasana"
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  formik.touched.password &&
                  formik.errors.password !== undefined
                    ? true
                    : false
                }
                helperText={
                  formik.touched.password &&
                  formik.errors.password !== undefined
                    ? formik.errors.password
                    : ""
                }
              />

              <TextField
                id="outlined-basic"
                label={width < 800 ? "Salasana" : "Toista salasana"}
                variant="outlined"
                error={passwordRepeatOnError()}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={
                  passwordRepeatOnError() ? "Salasanat eivät täsmää" : ""
                }
                onChange={(e) => {
                  formik.handleChange(e);
                  setSecondPassword(e.target.value);
                  const firstPassword = document.getElementById(
                    "password"
                  ) as HTMLInputElement | null;

                  if (!firstPassword) return;

                  if (e.target.value !== firstPassword.value) {
                    setPasswordsMatch(false);
                  } else {
                    setPasswordsMatch(true);
                  }
                }}
              />

              <PrimaryButton
                style={{
                  textTransform: "capitalize",
                  borderRadius: "7px",
                  marginTop: "24px",
                }}
                type={"submit"}
              >
                Luo käyttäjätili
              </PrimaryButton>
              <p
                style={{
                  marginTop: "24px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Onko sinulla jo tili? Kirjaudu sisään{" "}
                <Link href={"/login/kirjaudu"} className={styleUtils.link}>
                  täältä
                </Link>
              </p>
            </form>
          </FormikProvider>
        </div>
      </div>
    </ContentSection>
  );
}
