import { MapPinIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Role } from "@/types";

interface RoleCardProps {
  additionalClassNames?: string;
  role: Role;
}

export const RoleCard = (props: RoleCardProps) => {
  const { role } = props;
  const { icon: Icon } = role.category;
  return (
    <Link
      href={`/careers/${role.slug}`}
      className={`w-full cursor-pointer border border-gray-200 rounded-xl p-5 flex flex-col gap-5 items-start hover:bg-gray-50 transition-colors duration-300 ${props.additionalClassNames}`}
    >
      <div className="border border-gray-200 bg-white p-[14px] rounded-full flex">
        {<Icon className="h-6 w-6 text-gray-400" />}
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="text-2xl leading-8 font-semibold">{role.title}</h4>
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <UserGroupIcon className="h-6 w-6 text-gray-400" />
            <p className="text-lg leading-7 font-normal text-gray-500">
              {role.category.name}
            </p>
          </div>
          <div className="flex gap-3">
            <MapPinIcon className="h-6 w-6 text-gray-400" />
            <p className="text-lg leading-7 font-normal text-gray-500">
              {role.location}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
