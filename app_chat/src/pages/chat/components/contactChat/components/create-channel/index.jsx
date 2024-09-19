import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiClient from "@/lib/api-client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useAppStore } from "@/store";
import { GET_ALL_CONTACTS } from "@/utilites/constant";
import MultipleSelector from "@/components/ui/multipleselect";
import { CREATE_CHANNEL } from "@/utilites/constant";

const CreateChannel = () => {
  const { setSelectedChatData, setSelectedChatType, addChannel } =
    useAppStore();
  const [newChannelModal, setNewChannelModalOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true,
      });
      setContacts(res.data.contacts);
    };
    getData();
  }, []);
  const createChannel = async () => {
    try {
      if (channelName.length >= 0 && selectedContacts.length > 0) {
        const res = await apiClient.post(
          CREATE_CHANNEL,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.id),
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModalOpen(false);
          addChannel(res.data.channel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="dark:text-purple-500 size-5  hover:cursor-pointer hover:text-purple-500 hover:scale-110"
              onClick={() => {
                setNewChannelModalOpen(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new Channels</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModalOpen}>
        <DialogContent className="h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Thêm nhóm chat mới của bạn vào đây</DialogTitle>
            <DialogDescription>
              Thêm tên hoặc nickname của bạn vào đây
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Enter the Group name"
              onChange={(e) => {
                setChannelName(e.target.value);
              }}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              defaultOptions={contacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 ">
                  No results found.
                </p>
              }
            />
          </div>
          <div className="">
            <button
              className=" rounded-xl p-4 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
