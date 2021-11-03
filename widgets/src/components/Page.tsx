import { ComponentType } from "react";

interface Props {
  Content: ComponentType;
}

const Page = ({ Content }: Props) => {
  return (
    <div className="page">
      <Content />
    </div>
  );
};

export default Page;
