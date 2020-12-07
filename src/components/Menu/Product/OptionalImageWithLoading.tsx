import React, { ReactElement } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { pipe } from "fp-ts/lib/function";
import { fold, Option } from "fp-ts/lib/Option";

export const OptionalImageWithLoading = ({
  alt,
  image,
  havePlaceHolder: haveLoading = true,
  className,
}: {
  image: Option<string>;
  className?: string;
  alt: string;
  havePlaceHolder?: boolean;
}) =>
  pipe(
    image,
    fold<string, ReactElement | null>(
      () =>
        haveLoading ? (
          <Skeleton
            className={className}
            animation={false}
            height={60}
            width={60}
            style={{ transform: "none" }}
          />
        ) : null,
      (x) => <img loading="lazy" className={className} src={x} alt={alt} />
    )
  );
