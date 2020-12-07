import React from "react";

import "./Extra.style.scss";

const Extra = ({
  extra,
}: {
  extra: { name: string; suboptions: { name: string; id?: number; price?: number }[] };
}) => {
  return (
    <div className="extra">
      <div className="extra__name">{extra.name}</div>
      <div className="extra__options">
        {extra.suboptions.map(({ name, id, price }) => (
          <span key={id} className="extra__options__option">
            {name} <span>+${price}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Extra;
