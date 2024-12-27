import { ExternalLinkIcon } from "../atoms/icons/external-link-icon";

interface Section1Props {
  label: {
    title: string;
    icon: React.ReactNode;
  };
  title: string;
  subtitle: string;
  apps: AppsInterface[];
  cardSmall?: boolean;
}

export const ExploreWeb3CardsSection = ({
  label,
  title,
  subtitle,
  apps,
  cardSmall = false,
  ...props
}: Section1Props) => {
  return (
    <section
      className="lg:pl-[72px] lg:pt-[80px] lg:pb-[40px] pl-5 py-[25px]"
      {...props}
    >
      <div className="rounded-[20px] lg:ml-10 px-4 py-2 inline-flex items-center gap-2 border bg-black bg-opacity-5 border-black border-opacity-5">
        {label.icon}
        <p className="text-sm leading-5 font-medium">{label.title}</p>
      </div>

      <h3 className="text-2xl lg:text-4xl lg:ml-10 lg:leading-10 lg:max-w-[608px] leading-8 font-bold py-5">
        {title}
      </h3>
      <p className="leading-7 text-lg font-light lg:ml-10 text-gray-500 max-w-[608px] pr-5 lg:pr-0">
        {subtitle}
      </p>
      <div className="overflow-scroll z-50 lg:pl-[10] overflow-x-auto scrollbar-hide">
        <div className="overflow-visible items-stretch lg:ml-10 mt-10 pb-[40px] gap-5 justify-start mr-5 inline-flex">
          {apps.map((item) => {
            return (
              <AppComponent
                key={item.description}
                title={item.title}
                description={item.description}
                illustration={item.illustration}
                gradient={item.gradient}
                cardSmall={cardSmall}
                url={item.url}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface AppsInterface {
  title: React.ReactElement;
  description: string;
  illustration: React.ReactElement;
  gradient: string;
  url: string;
  cardSmall?: boolean;
}

const AppComponent = ({
  title,
  description,
  illustration,
  gradient,
  url,
  cardSmall = false,
}: AppsInterface) => {
  const cardStyle = cardSmall ? "lg:w-[480px]" : "lg:w-[598px]";

  return (
    <a
      style={{
        backgroundImage: `linear-gradient(291deg, ${gradient}, #FFF)`,
      }}
      target={"_blank"}
      href={url}
      className={`shadow-explore-web3-card transition-all duration-100 hover:shadow-explore-web3-card-hover ${cardStyle} w-[306px] text-start cursor-pointer flex lg:pt-10 pt-5 lg:px-10 px-5 rounded-lg border border-gray-200 flex-col items-start justify-between gap-5`}
    >
      <div>
        <div className="flex gap-2 mb-5 items-start  justify-between">
          {title}
          <ExternalLinkIcon className="text-black" />
        </div>

        <p className="text-sm leading-6 font-normal text-gray-500">
          {description}
        </p>
      </div>

      <div className="no-pointer-events w-full pointer-events-none">
        {illustration}
      </div>
    </a>
  );
};
