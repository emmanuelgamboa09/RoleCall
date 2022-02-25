import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectMe } from "../redux/store";
import { onboardingValidateMe } from "../src/validate/onboarding";

export default function useOnboardUserChecker() {
  const [validate, setValidate] = useState(false);
  const me = useSelector(selectMe);
  useEffect(() => {
    if (me) {
      const { error } = onboardingValidateMe(me);
      setValidate(error ? true : false);
    }
  }, [me]);

  return validate;
}
