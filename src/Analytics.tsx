import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}
