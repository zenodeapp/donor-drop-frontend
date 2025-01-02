export type IBackground = {
  id?: string;
  overlayId?: string;
  height?: string;
};

export type IHeader = {
  title?: string;
  children?: React.ReactNode;
};

export type IContent = {
  id?: string;
  children: React.ReactNode;
};

export type IFooter = {
  title?: string;
  showSocials?: boolean;
  className?: string;
  style?: React.CSSProperties | undefined;
  children?: React.ReactNode;
};

export type IMeta = {
  prefix?: string;
  suffix?: string;
  title?: string;
  keywords?: string;
  keywords_extra?: string;
  description?: string;
  separator?: string;
};
