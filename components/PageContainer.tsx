import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PageContainer = ({ children }: Props) => {
  return <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>;
};

export { PageContainer };
