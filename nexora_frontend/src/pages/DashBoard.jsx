import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AvatarAndCoverImage from "../Components/DashBoard/AvatarAndCoverImage";
import { useChannelData } from "../Features/DashBoard/useChannelData";
import { useQueryClient } from "@tanstack/react-query";
import ChannelInfo from "../Components/DashBoard/ChannelInfo";
import { SearchHeaderDiv, SideBar } from "../Components/index";
import { useDashboardData } from "../Features/DashBoard/useDashBoardData";
import { renderSection } from "../Features/DashBoard/renderSection";
import { useGetUserPlaylists } from "../Features/DashBoard/useGetUserPlaylists";

function DashBoard() {
  const { _id } = useParams();
  const { data } = useChannelData(_id);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const ownerMenu = [
    "All Videos",
    "Liked Videos",
    "Watch History",
    "Playlists",
    "Tweets",
  ];

  const visitorMenu = ["All Videos", "Playlists", "Tweets"];
  const menuItems = data?.isOwner ? ownerMenu : visitorMenu;

  const [activeIndex, setActiveIndex] = useState(0);

  const activeSection = menuItems[activeIndex];



  const isPlaylistSection = activeSection === "Playlists";

  
  const playlistData = useGetUserPlaylists(_id, isPlaylistSection);
  const paginatedData = useDashboardData(
    activeSection,
    _id,
    isPlaylistSection
  );

  const dashboardData = isPlaylistSection ? playlistData : paginatedData;
  const content = renderSection(
    activeSection,
    dashboardData,
    data?.isOwner,
    _id,
    showModal,
    setShowModal,
    selectedVideoId,
    setSelectedVideoId
  );

  const qc = useQueryClient();
  

  useEffect(() => {
    const invalidate = async () =>
      await qc.invalidateQueries({ queryKey: ["Watch History"] });
    invalidate();
  }, []);

  return (
    <div className="text-2xl bg-background border-0  border-blue-50 p-3 rounded-lg min-h-screen  relative">
      <SearchHeaderDiv isOpen={() => setIsOpen((prev) => !prev)} />
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="  rounded-2xl py-4">
        <div className="flex    justify-center   md:gap-1 flex-col md:flex-row p-2">
          <div className="w-3/3 ">
            <AvatarAndCoverImage
              avatar={data?.avatar}
              coverImage={data?.coverImage}
              username={data?.username}
            />
          </div>

          
          <ChannelInfo data={data} userId={_id} />
          <div></div>
        </div>
      </div>
      <div className="px-5 md:pt-10">
        <ul
          className=" flex my-5 gap-5 text-xl overflow-x-auto scrollbar-hide
            "
        >
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                    cursor-pointer p-1 rounded-2xl transition px-6
                    ${
                      activeIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-accent text-gray-400"
                    }
                  `}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {content}
    </div>
  );
}

export default DashBoard;
