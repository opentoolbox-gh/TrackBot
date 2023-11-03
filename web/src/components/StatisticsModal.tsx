import { Modal, Datepicker } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { axios } from "../utils/axios.config";
import { StatsResponse, Video } from "../utils/@types";

interface Props {
  show: boolean;
  onClose: () => void;
}

const StatisticsModal = ({ show, onClose }: Props) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  const getStatistics = useCallback(async () => {
    console.log("getting new stats");
    try {
      setLoading(true);
      const { data } = await axios.get<StatsResponse>(
        `/video/statistics/${selectedDate.split(",")[0].replace(/\//g, "-")}`
      );
      console.log(data);
      setVideos(data.data);
      setUsers(
        Array.from(
          new Set(
            data.data.reduce(
              (acc: string[], curr: Video) => [
                ...acc,
                ...(curr.watchedBy ?? []),
              ],
              []
            )
          )
        )
      );
    } catch (error) {
      console.log("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      getStatistics();
    }
  }, [selectedDate, getStatistics]);

  useEffect(() => {
    console.log({ users });
  }, [users]);
  return (
    <Modal {...{ show, onClose }} dismissible>
      {/* <div
        id="statisticsModal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#00000044]"
        data-modal-backdrop="static"
      > */}
      <div className="relative w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-6">
          <Datepicker
            className={"mb-2"}
            // value={'2022-01-01'}
            value={selectedDate}
            onSelectedDateChanged={(date: Date) => {
              setSelectedDate(date.toLocaleString().split(",")[0]);
            }}
            disabled={loading}
          />
          <h1 className="dark:text-white font-bold text-2xl">
            {loading ? "Loading..." : `Statistics (${videos.length} videos)`}
          </h1>
          <div className="flex flex-col gap-2 mt-2 mb-4">
            {videos.map((el, i) => {
              return (
                <div key={i} className="flex flex-row gap-2 items-center flex-wrap">
                  <div className="px-2 rounded-full dark:bg-gray-500 text-xs" color="info">Vid {i+1}</div>
                  <span className="dark:text-white">{el.title}</span>
                </div>
              );
            })}
          </div>
          <div className="relative overflow-x-auto">
            {videos.length && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    {videos.map((_: Video, i: number) => {
                      return (
                        <th scope="col" className="px-6 py-3" key={i}>
                          Vid {i + 1}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {!users.length && (
                    <h1 className="text-center font-bold dark:text-white w-full">
                      No Users watched
                    </h1>
                  )}
                  {users.map((user: string, i: number) => {
                    return (
                      <tr
                        key={i}
                        className="bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                      >
                        <td className="px-6 py-4 font-medium">{user}</td>
                        {videos.map((video: Video, j: number) => {
                          return (
                            <td
                              key={j}
                              className="px-6 py-4 font-medium text-center"
                            >
                              {video.watchedBy?.includes(user) ? "✅" : "❌"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </Modal>
  );
};

export default StatisticsModal;
