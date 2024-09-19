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
import { SEARCH_CONTACT } from "@/utilites/constant";
import mainEmptyLogo from "@/assets/images/mainEmpty.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HOST } from "@/utilites/constant";
import { useAppStore } from "@/store";

const NewDm = () => {
  const { setSelectedChatData, setSelectedChatType } = useAppStore();
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContactList, setSearchContactList] = useState([]);
  const searchContact = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACT,
          { name: searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchContactList(res.data.contacts);
        }
      } else {
        setSearchContactList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const selectNewContact = (contact) => {
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setOpenNewContactModel(false);
    setSearchContactList([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="dark:text-purple-500 size-5  hover:cursor-pointer hover:text-purple-500 hover:scale-110"
              onClick={() => {
                setOpenNewContactModel(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Direct Message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please enter the nickname of the person you want to message
            </DialogTitle>
            <DialogDescription>
              You can add a nickname for the person you want to message
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Enter the nickname"
              onChange={(e) => {
                searchContact(e.target.value);
              }}
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col gap-5">
              {searchContactList.map((contact) => {
                return (
                  <div
                    key={contact._id}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      selectNewContact(contact);
                    }}
                  >
                    <div className="relative w-12 h-12">
                      {contact?.image ? (
                        <img
                          src={`${HOST}${contact.image}`}
                          alt="Avatar preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl"
                          style={{ backgroundColor: contact.color }}
                        >
                          {contact ? getInitials(contact.name) : "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h1>Name: {contact.name}</h1>
                      <p>Nickname: {contact.nickname}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          {searchContactList.length <= 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-8">
                <img
                  src={mainEmptyLogo}
                  alt="Syncronus Logo"
                  className="w-40 "
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Hi search your{" "}
                <strong className="text-purple-700">Contact</strong>
              </h1>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
