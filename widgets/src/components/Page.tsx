import { ComponentType, FC, ReactHTML } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  Content?: ComponentType;
};

const Page: FC<Props> = ({ Content, children, className = "", ...rest }) => {
  className += " page";

  return (
    <div {...rest} className={className}>
      {Content ? <Content /> : children}
    </div>
  );
};

export default Page;
