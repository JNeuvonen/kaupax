import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import { LayoutContext } from "@/context/layout";
import styles from "@/styles/landing.module.css";
import { NEUTRAL_GREY_50, PAIKKAKUNNAT } from "@/utils/constants";
import { ChevronRight } from "@/utils/icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Autocomplete, Box, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
interface Props {
  layout: LayoutContext;
}

export default function FirstSection({ layout }: Props) {
  const router = useRouter();
  const [autocompleteFocused, setAutocompleteFocused] = React.useState(false);

  const handleCta = () => {
    router.push("/ilmoitus");
  };
  return (
    <Box
      style={{
        maxWidth: layout.layoutProps.contentMaxWidth,
      }}
      className={styles.contentContainer}
    >
      <Box
        className={styles.content}
        style={{
          maxWidth: layout.layoutProps.contentMaxWidth,
        }}
      >
        <Box className={styles.mainDiv}>
          <Box>
            <h1 className={styles.mainTitle}>
              Kilpailuta alueesi kiinteistönvälittäjät
            </h1>

            <p>
              Käyttämällä meidän kilpailutuspalvelua saat tarjouksen jopa
              kymmeniltä kiinteistönvälittäjiltä ja pääset vertailemaan
              välittäjiä sekä välityspalkkiota. Palvelu on ilmainen.
            </p>

            <div className={styles.ctaDiv}>
              <Autocomplete
                id="combo-box-demo"
                options={PAIKKAKUNNAT}
                size={"small"}
                onFocus={() => setAutocompleteFocused(true)}
                onBlur={() => setAutocompleteFocused(false)}
                forcePopupIcon={true}
                noOptionsText={"Ei tuloksia"}
                className={styles.input}
                clearIcon={false}
                popupIcon={
                  !autocompleteFocused ? (
                    <div style={{ marginTop: "-10px" }}>
                      <ArrowDropDownIcon />
                    </div>
                  ) : (
                    false
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      style: { fontSize: "23px" },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      style: { fontSize: "23px" },
                    }}
                    label={"Valitse paikkakunta"}
                  />
                )}
              />

              <PrimaryButton
                sx={{
                  width: "145px",
                  height: "49px",
                  padding: "14px 20px",
                  color: NEUTRAL_GREY_50,
                  fontSize: "16px",
                }}
                onClick={handleCta}
                className={styles.primaryButton}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "5px",
                  }}
                >
                  <div>Seuraava</div>
                  <ChevronRight
                    width={"18px"}
                    fill={NEUTRAL_GREY_50}
                    style={{ marginLeft: "5px" }}
                  />
                </div>
              </PrimaryButton>
            </div>
          </Box>
        </Box>
        <Image
          width={0}
          height={0}
          sizes={"100vw"}
          src={"/front-page-img.png"}
          className={styles.landingPageImage}
          alt={"test"}
        />
      </Box>
    </Box>
  );
}
