import { useEffect } from "react";
import { View } from "react-native";
import { useNavigate } from "react-router";

type RedirectProps = {
  url: string;
}

const Redirect = (props: RedirectProps) => {
  const { url } = props;

  const navigate = useNavigate();

  useEffect(() => {
    navigate(url);
  }, [url]);

  return <View />;
};

export default Redirect;