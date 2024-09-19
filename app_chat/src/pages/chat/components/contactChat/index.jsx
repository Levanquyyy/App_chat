import contactChatLogo from "@/assets/images/contactchat.png";
import ProfileInfo from "./components/profile-info";
import NewDm from "./components/new-dm";
import { useEffect } from "react";
import apiClient from "@/lib/api-client";
import { GET_CONTACT_FOR_DM_LIST } from "@/utilites/constant";
import { useAppStore } from "@/store";
import { ContactList } from "@/components/ui/contactList";
import CreateChannel from "./components/create-channel";
import { GET_CHANNELS } from "@/utilites/constant";
export const ContactChat = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();
  useEffect(() => {
    const getContactForDMList = async () => {
      try {
        const res = await apiClient.get(GET_CONTACT_FOR_DM_LIST, {
          withCredentials: true,
        });
        if (res.data) {
          setDirectMessagesContacts(res.data.contacts);
        }
      } catch (error) {
        console.error("Failed to fetch contacts for DM list:", error);
      }
    };
    const getChannels = async () => {
      try {
        const res = await apiClient.get(GET_CHANNELS, {
          withCredentials: true,
        });
        if (res.data.channels) {
          setChannels(res.data.channels);
        }
      } catch (error) {
        console.error("Failed to fetch contacts for DM list:", error);
      }
    };
    getContactForDMList();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);
  return (
    <div className=" overflow-hidden relative h-[calc(100%-32px)] md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#f1f1c24] border-r-2 border-[#f4f4f4]">
      <div className="pt-3 flex items-center gap-4">
        <img src={contactChatLogo} alt="contactChatLogo" className="w-24" />
        <span className="text-xl font-bold">Chat</span>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <h6 className=" roboto-medium uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            Direct Messages
          </h6>
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <h6 className=" roboto-medium uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            Channels
          </h6>

          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>

      <ProfileInfo />
    </div>
  );
};
