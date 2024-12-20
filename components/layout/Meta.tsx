import Head from "next/head";
import React from "react";
import { IMeta } from "./_types";
import { useLayout } from "../../context/LayoutProvider";

const Meta = ({
  prefix,
  suffix,
  title,
  keywords,
  keywords_extra,
  description,
}: IMeta) => {
  const { displayMode, defaultMeta } = useLayout();
  const _prefix = prefix ? prefix : defaultMeta.prefix;
  const _suffix = suffix ? suffix : defaultMeta.suffix;
  const _description = description ? description : defaultMeta.description;
  const _keywords = keywords ? keywords : defaultMeta.keywords;
  const _keywords_extra = keywords_extra ? ", " + keywords_extra : "";
  const _title = title ? title : defaultMeta.title;
  const __title = `${_prefix}${
    _prefix && _title && defaultMeta.separator
  }${_title}${
    (_title || _prefix) && _suffix && defaultMeta.separator
  }${_suffix}`;

  return (
    <Head>
      {displayMode === "browser" ? (
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=2, user-scalable=1'
        />
      ) : (
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
      )}
      <title>{__title}</title>
      <meta name='description' content={_description} />
      {_keywords && (
        <meta name='keywords' content={_keywords + _keywords_extra} />
      )}
      <meta name='og:title' property='og:title' content={__title} />
      <meta
        name='og:description'
        property='og:description'
        content={_description}
      />
    </Head>
  );
};

export default Meta;
