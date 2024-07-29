import { ReactElement, SVGProps } from "react";

export interface RoleCategory {
  name: string;
  banner: ReactElement;
  icon: React.ElementType;
}

export interface Role {
  slug: string;
  category: RoleCategory;
  title: string;
  team: string;
  location: string;
  description: JSX.Element;
}

export interface OpenRoles {
  roles: Role[];
}
