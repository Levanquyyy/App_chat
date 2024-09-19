import mainEmptyLogo from "@/assets/images/mainEmpty.png";

export const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8">
        <img src={mainEmptyLogo} alt="Syncronus Logo" className="" />
      </div>
      <h1 className="text-3xl font-bold mb-2">
        Hi! Welcome to Syncronus Chat App.
      </h1>

      <p className="text-lg text-gray-400">
        Select a chat or start a new conversation
      </p>
    </div>
  );
};
