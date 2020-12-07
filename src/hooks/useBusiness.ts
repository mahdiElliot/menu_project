import { useParams } from "react-router-dom";

export const useBusiness = () => {
  const params = useParams<{ businessID: string; menuID: string }>();
  const businessId = Number(params.businessID);
  const menuId = Number(params.menuID);

  return {
    businessId,
    menuId,
  };
};
