import ChatBanner from "./chat-banner";

export default function ChatLayout() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <ChatBanner />
        </div>
    );
}