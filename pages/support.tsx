import { GetServerSideProps } from "next";

const Support = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.writeHead(302, { Location: "https://zenode.app/support" });
  res.end();
  return { props: {} };
};

export default Support;
