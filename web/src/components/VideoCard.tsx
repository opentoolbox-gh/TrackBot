import { Video } from "../utils/@types";

interface Props extends Video {
  className?: string;
  onSelectedForToday?: (selected: boolean) => void;
}

const VideoCard = (props: Props) => {
  let statusBadge = null;
  if (props.status === "watched") {
    statusBadge = (
      <span
        className={
          "bg-green-100 text-green-800 text-sm uppercase font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
        }
      >
        watched
      </span>
    );
  } else if (props.status === "isWatching") {
    statusBadge = (
      <span
        className={
          "bg-blue-100 text-blue-800 text-sm uppercase font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
        }
      >
        watching
      </span>
    );
  } else if (props.status === "toWatch") {
    statusBadge = (
      <span
        className={
          "bg-gray-100 text-gray-800 text-sm uppercase font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
        }
      >
        to be watched
      </span>
    );
  }

  return (
    <a
      // href={props.url}
      href="#"
      className={
        "flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 relative " +
        props.className
      }
    >
      {localStorage.getItem('currentUser') && props.status !== 'watched' && (
        <div className="absolute top-1 right-3">
          <input
            id="default-checkbox"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={
              props.date !== undefined || props.date !== null
                ? new Date(props.date!).setHours(0, 0, 0, 0) ===
                  new Date().setHours(0, 0, 0, 0)
                : false
            }
            onChange={e => props.onSelectedForToday!(e.target.checked)}
          />
        </div>
      )}
      <img
        className="object-cover rounded-t-lg h-full min-h-full md:h-auto lg:w-48 md:rounded-none md:rounded-l-lg md:w-24"
        src={props.thumbnail}
        alt="Testing"
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {props.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {statusBadge}
        </p>
      </div>
    </a>
  );
};

export default VideoCard;
