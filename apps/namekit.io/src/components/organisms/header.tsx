import cc from "classcat";

export const Header = () => {
  return (
    <div className="lg:px-0 mx-auto max-w-6xl px-6 bg-white">
      <div className="flex h-[56px] items-center lg:h-[70px]">
        {/* Shared markup */}
        <div
          role="button"
          className={cc(["left-0 top-0 fixed w-screen h-screen z-20"])}
        ></div>
      </div>
    </div>
  );
};
