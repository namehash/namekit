import cc from "classcat";
import { DotPattern } from "../atoms/icons/explore-web3-lp/pattern";
import { ExternalLinkIcon } from "../atoms/icons/external-link-icon";

interface ExploreWeb3ProductSectionProps {
  gradient: string;
  icon: React.ReactElement;
  title: string;
  image: React.ReactElement;
  description: string;
  afterDescription?: string;
  buttonGradient?: string;
  titleStyle?: string;
  descriptionStyle?: string;
  showButton?: boolean;
  showPattern?: boolean;
  patternStyle?: string;
  buttonStyle?: string;
  buttonUrl?: string;
  imageStyle?: string;
}

export const ExploreWeb3ProductSection = ({
  gradient,
  image,
  icon,
  title,
  description,
  buttonGradient,
  buttonStyle,
  descriptionStyle,
  titleStyle,
  showButton = true,
  showPattern = true,
  patternStyle = "opacity-[0.07]",
  afterDescription,
  imageStyle = "justify-center",
  buttonUrl,
  ...props
}: ExploreWeb3ProductSectionProps) => {
  return (
    <section
      style={{
        backgroundImage: gradient,
      }}
      className="lg:p-0 p-5 relative flex flex-col items-center lg:flex-row w-full lg:h-[480px] overflow-hidden"
      {...props}
    >
      {showPattern && (
        <DotPattern
          className={cc([`opacity-[.05] absolute top-0`, patternStyle])}
        />
      )}
      <div
        className={cc([
          " z-20 sm:w-1/2 flex w-full h-full items-center justify-center",
          imageStyle,
        ])}
      >
        <div
          className={cc([
            "max-w-[680px] w-full h-full flex justify-center",
            imageStyle,
          ])}
        >
          {image}
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center text-white z-20">
        {icon}
        <h3
          className={cc([
            "text-2xl font-bold mt-5 lg:mt-10 lg:text-4xl leading-8 lg:leading-10 mb-4 lg:max-w-[608px]",
            titleStyle,
          ])}
        >
          {title}
        </h3>
        <p
          className={cc([
            "text-lg lg:text-lg leading-6 lg:leading-8 font-light lg:max-w-[608px]",
            descriptionStyle,
          ])}
        >
          {description}
          {!!afterDescription && (
            <span>
              <br />
              <br />
              {afterDescription}
            </span>
          )}
        </p>
        {showButton && (
          <div>
            <a
              className={cc([
                "hover:opacity-80 text-sm lg:text-base leading-5 lg:leading-6 w-full lg:w-auto mt-5 inline-flex items-center justify-center gap-3 bg-black px-4 lg:px-6 py-2 lg:py-3.5 rounded-md transition-all duration-200",
                buttonStyle,
              ])}
              href={buttonUrl}
              target={"_blank"}
              style={{
                backgroundImage: buttonGradient || "none",
              }}
            >
              Get started
              <ExternalLinkIcon />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
