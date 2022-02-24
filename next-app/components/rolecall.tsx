import { ReactNode, FC } from "react";
import useInitializeMe from "../hooks/useInitializeMe";

interface InitializeAppInterface {
  children: ReactNode;
}

// Utilized to initialize App Features
const RollCall: FC<InitializeAppInterface> = ({ children }) => {
  useInitializeMe();
  return <>{children}</>;
};

export default RollCall;
