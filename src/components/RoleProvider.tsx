import React, { ReactNode, useContext } from "react";
import { useImmer } from "use-immer";

const RoleContext = React.createContext<any>(null);

export enum RoleType {
  Streamer = 'Streamer',
  Viewer = 'Viewer'
}

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useImmer({
    role: RoleType.Streamer
  });

  const setRole = (role: RoleType) => 
    setState(draft => {
      draft.role = role;
    });

  return <RoleContext.Provider
    value={{
      role: state.role,
      isStreamer: state.role === RoleType.Streamer,
      setRole
    }}
  >
    {children}
  </RoleContext.Provider>
}

export const useRoleContext = () => useContext(RoleContext);