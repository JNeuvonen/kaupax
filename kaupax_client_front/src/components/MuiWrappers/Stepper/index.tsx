import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { Step, StepIconProps, StepLabel, Stepper } from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

interface StepperProps {
  stepLabels: string[];
  stepIcons: { [index: string]: React.ReactElement };
  activeStep: number;
  stepsCompleted: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function StepperWrapper({
  stepLabels,
  stepIcons,
  activeStep,
  stepsCompleted,
  setActiveStep,
}: StepperProps) {
  const { width } = useWindowDimensions();
  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {stepIcons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  function clickableStep(step: number) {
    return step <= stepsCompleted;
  }

  function stepOnClick(step: number) {
    if (step <= stepsCompleted) {
      setActiveStep(step);
    }
  }

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<ColorlibConnector />}
    >
      {stepLabels.map((label, i) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={ColorlibStepIcon}
            onClick={() => stepOnClick(i)}
            style={{ cursor: clickableStep(i) ? "pointer" : "not-allowed" }}
          >
            {width < 600 ? "" : label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, #1D4ED8 0%, #0d35a6 50%, #1976D2 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, #1D4ED8 0%, #0d35a6 50%, #1976D2 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, #1D4ED8 0%, #0d35a6 50%, #1976D2 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, #1D4ED8 0%, #0d35a6 50%, #1976D2 100%)",
  }),
}));
