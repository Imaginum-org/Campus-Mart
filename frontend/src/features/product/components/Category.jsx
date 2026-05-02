import { Link } from "react-router-dom";

const Category = ({ title, imageSrc }) => {
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/category/${slug}`}
      aria-label={`Browse ${title} category`}
      className="lg:min-w-[20vw] xl:min-w-[16vw] md:min-w-[22vw] min-w-[34vw] h-9 md:h-10 lg:h-12 flex justify-between items-center px-3 lg:rounded-lg rounded-md shadow-[inset_5px_-7px_21.299999237060547px_0px_rgba(57,79,241,0.10)] border border-neutral-200 bg-white lg:pl-7 xl:pl-10 md:pl-6 hover:bg-slate-300 dark:bg-zinc-900 dark:shadow-[inset_5px_-7px_21.299999237060547px_0px_rgba(57,79,241,0.10)] dark:border dark:border-neutral-700"
    >
      <h1 className="font-semibold xl:text-lg lg:text-[1.6vw] md:text-[2vw] text-[2.8vw] font-robotoFlex text-zinc-800 dark:text-white">
        {title}
      </h1>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${title} icon`}
          className="object-contain size-7 lg:size-10 lg:ml-0"
          loading="lazy"
        />
      ) : (
        <p className="text-gray-500 text-xs">NA image</p>
      )}
    </Link>
  );
};

export default Category;
