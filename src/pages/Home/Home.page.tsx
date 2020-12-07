import React from "react";
import { map, remoteData } from "@devexperts/remote-data-ts";
import { pipe } from "fp-ts/lib/function";
import { sequenceS } from "fp-ts/lib/Apply";

import { useFetchOne } from "../../hooks/UseFetchOne";
import { useFetchMany } from "../../hooks/useFetchMany";
import { useBusiness } from "../../hooks/useBusiness";

import { show } from "../../utils/show.util";
import { filterOrElse } from "../../utils";

import { MenuServices } from "../../models/Menu.model";

import Menu from "../../components/Menu/Menu.view";
import Skeleton from "./Home.Skeleton";

import { BusinessNotAvailableError } from "../../functions/Errors.Fns";

import "./Home.style.scss";

const RTSequenceS = sequenceS(remoteData);

const Home = () => {
  const { businessId, menuId } = useBusiness();

  return pipe(
    {
      Menu: useFetchOne("Menu", { parents: [businessId], id: menuId }),
      Category: useFetchMany("Categories", { parents: [businessId] }),
      Business: pipe(
        useFetchOne("Business", { id: businessId }),
        filterOrElse((x) => x.enabled, BusinessNotAvailableError)
      ),
    },
    RTSequenceS,
    map((x) => ({ CategoryList: MenuServices.getCategoryList(x.Category, x.Menu), ...x })),
    show(
      (x) => <Menu categories={x.CategoryList} business={x.Business} />,
      () => <Skeleton />
    )
  );
};

export default Home;
