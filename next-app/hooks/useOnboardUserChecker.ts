import { useEffect, useState } from "react";
import { onboardingValidateMe } from "../src/validators/user";
import useMe from "./useMe";

export default function useOnboardUserChecker() {
  const [validate, setValidate] = useState(false);
  const me = useMe();
  useEffect(() => {
    if (me) {
      const { error } = onboardingValidateMe(me);
      setValidate(error ? true : false);
    }
  }, [me]);

  return validate;
}
