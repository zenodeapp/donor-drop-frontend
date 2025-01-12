import { GetServerSideProps } from "next";

const Hub = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.writeHead(302, { Location: "https://zenode.app/hub" });
  res.end();
  return { props: {} };
};

export default Hub;
