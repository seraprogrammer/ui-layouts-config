import { FormEvent, useRef, useEffect, useState } from "react";

interface GrokInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
  selectedProvider: "google" | "groq";
  setSelectedProvider: (provider: "google" | "groq") => void;
}

const GrokInput = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  selectedProvider,
  setSelectedProvider,
}: GrokInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bottom-0 w-full text-base flex flex-col gap-2 items-center justify-center relative z-10"
    >
      <div className="flex flex-row gap-2 justify-center w-full relative">
        <input className="hidden" multiple type="file" name="files" />
        <div className="query-bar group bg-gray-800 duration-100 relative w-full ring-1 ring-gray-700 ring-inset overflow-hidden max-w-[51rem] hover:ring-gray-600 hover:bg-gray-750 focus-within:ring-1 focus-within:ring-gray-500 hover:focus-within:ring-gray-500 pb-12 px-2 rounded-3xl shadow shadow-gray-700/10">
          <div
            className="w-full flex-row gap-2 mt-3 px-1 whitespace-nowrap hidden flex-wrap will-change-[mask-image] [mask-image:linear-gradient(to_right,transparent_0,black_0px,black_calc(100%_-_40px),transparent_100%)]"
            style={{ opacity: 1, transform: "none" }}
          ></div>
          <div className="relative z-10">
            {/* Placeholder text - only show when input is empty and not focused */}
            <span
              className={`absolute px-2 py-5 text-gray-400 pointer-events-none transition-opacity duration-200 ${
                input || isFocused ? "opacity-0" : "opacity-100"
              }`}
            >
              {`How can ${
                selectedProvider === "google" ? "Google AI" : "Groq"
              } help?`}
            </span>
            <textarea
              ref={inputRef}
              dir="auto"
              aria-label="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="w-full px-2 pt-5 mb-5 bg-transparent focus:outline-none text-gray-100 align-bottom"
              style={{ resize: "none", height: input ? "auto" : "44px" }}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-1.5 absolute inset-x-0 bottom-0 border-2 border-transparent p-2 max-w-full">
            {/* Attach button */}
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default h-9 rounded-full py-2 relative px-2 transition-all duration-150 bg-transparent border w-9 aspect-square border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              type="button"
              aria-label="Attach"
              tabIndex={0}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-[2]"
              >
                <path
                  d="M10 9V15C10 16.1046 10.8954 17 12 17V17C13.1046 17 14 16.1046 14 15V7C14 4.79086 12.2091 3 10 3V3C7.79086 3 6 4.79086 6 7V15C6 18.3137 8.68629 21 12 21V21C15.3137 21 18 18.3137 18 15V8"
                  stroke="currentColor"
                ></path>
              </svg>
            </button>

            {/* Middle section with DeepSearch and Think buttons */}
            <div
              className="flex grow gap-1.5 max-w-full"
              style={{ transform: "none", opacity: 1 }}
            >
              <div className="grow flex gap-1.5 max-w-full">
                {/* DeepSearch toggle */}
                <div className="flex border rounded-full items-center max-h-[36px] box-border transition-colors duration-100 relative overflow-hidden border-gray-600 hover:border-gray-500">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50 disabled:cursor-default text-gray-200 h-9 rounded-full px-3.5 py-2 group transition-colors duration-100 focus-visible:ring-transparent box-border relative overflow-hidden rounded-r-none pr-3 bg-transparent hover:bg-gray-700 focus-visible:bg-gray-700"
                    type="button"
                    tabIndex={0}
                    aria-pressed="false"
                    aria-label="DeepSearch"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-[2] text-gray-400 group-hover:text-gray-200"
                    >
                      <path
                        d="M19.2987 8.84667C15.3929 1.86808 5.44409 5.76837 7.08971 11.9099C8.01826 15.3753 12.8142 14.8641 13.2764 12.8592C13.6241 11.3504 10.2964 12.3528 10.644 10.844C11.1063 8.839 15.9022 8.32774 16.8307 11.793C18.5527 18.2196 7.86594 22.4049 4.71987 15.2225"
                        strokeWidth="5"
                        strokeLinecap="round"
                        className="stroke-black/10 dark:stroke-white/20 transition-all duration-200 origin-center opacity-0 scale-0"
                      ></path>
                      <path
                        d="M2 13.8236C4.5 22.6927 18 21.3284 18 14.0536C18 9.94886 11.9426 9.0936 10.7153 11.1725C9.79198 12.737 14.208 12.6146 13.2847 14.1791C12.0574 16.2581 6 15.4029 6 11.2982C6 3.68585 20.5 2.2251 22 11.0945"
                        stroke="currentColor"
                        className="transition-transform duration-200 eas-out origin-center rotate-0"
                      ></path>
                    </svg>
                    <span>DeepSearch</span>
                  </button>
                  <div
                    className="h-4 w-[1px] bg-gray-600 focus:outline-none"
                    tabIndex={-1}
                  ></div>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50 disabled:cursor-default text-gray-200 h-9 rounded-full px-3.5 py-2 transition-colors duration-100 relative overflow-hidden focus-visible:ring-transparent rounded-l-none pl-2 pr-3 bg-transparent hover:bg-gray-700 focus-visible:bg-gray-700"
                    type="button"
                    aria-label="Change mode"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-[2] text-gray-400"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeLinecap="square"
                      ></path>
                    </svg>
                  </button>
                </div>

                {/* Think button */}
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default text-gray-200 h-9 rounded-full px-3.5 py-2 group transition-colors duration-100 relative overflow-hidden border bg-transparent border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                  type="button"
                  tabIndex={0}
                  aria-pressed="false"
                  aria-label="Think"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-[2] group-hover:text-gray-200 text-gray-400"
                  >
                    <path
                      d="M19 9C19 12.866 15.866 17 12 17C8.13398 17 4.99997 12.866 4.99997 9C4.99997 5.13401 8.13398 3 12 3C15.866 3 19 5.13401 19 9Z"
                      className="fill-yellow-100 dark:fill-yellow-400/40 origin-center transition-all duration-100 scale-0 opacity-0"
                    ></path>
                    <path
                      d="M15 16.1378L14.487 15.2794L14 15.5705V16.1378H15ZM8.99997 16.1378H9.99997V15.5705L9.51293 15.2794L8.99997 16.1378ZM18 9C18 11.4496 16.5421 14.0513 14.487 15.2794L15.5129 16.9963C18.1877 15.3979 20 12.1352 20 9H18ZM12 4C13.7598 4 15.2728 4.48657 16.3238 5.33011C17.3509 6.15455 18 7.36618 18 9H20C20 6.76783 19.082 4.97946 17.5757 3.77039C16.0931 2.58044 14.1061 2 12 2V4ZM5.99997 9C5.99997 7.36618 6.64903 6.15455 7.67617 5.33011C8.72714 4.48657 10.2401 4 12 4V2C9.89382 2 7.90681 2.58044 6.42427 3.77039C4.91791 4.97946 3.99997 6.76783 3.99997 9H5.99997ZM9.51293 15.2794C7.4578 14.0513 5.99997 11.4496 5.99997 9H3.99997C3.99997 12.1352 5.81225 15.3979 8.48701 16.9963L9.51293 15.2794ZM9.99997 19.5001V16.1378H7.99997V19.5001H9.99997ZM10.5 20.0001C10.2238 20.0001 9.99997 19.7763 9.99997 19.5001H7.99997C7.99997 20.8808 9.11926 22.0001 10.5 22.0001V20.0001ZM13.5 20.0001H10.5V22.0001H13.5V20.0001ZM14 19.5001C14 19.7763 13.7761 20.0001 13.5 20.0001V22.0001C14.8807 22.0001 16 20.8808 16 19.5001H14ZM14 16.1378V19.5001H16V16.1378H14Z"
                      fill="currentColor"
                    ></path>
                    <path d="M9 16.0001H15" stroke="currentColor"></path>
                    <path
                      d="M12 16V12"
                      stroke="currentColor"
                      strokeLinecap="square"
                    ></path>
                  </svg>
                  <span>Think</span>
                </button>
              </div>

              {/* Model selector */}
              <div className="flex items-center">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default text-gray-200 hover:bg-gray-700 rounded-full px-3.5 py-2 flex-row pl-3 pr-2.5 h-9 border border-gray-600 hover:border-gray-500"
                  type="button"
                  onClick={() =>
                    setSelectedProvider(
                      selectedProvider === "google" ? "groq" : "google"
                    )
                  }
                >
                  <span className="inline-block text-gray-200 text-xs">
                    {selectedProvider === "google" ? "Gemini" : "DeepSeek"}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-[2] size-3 text-gray-400 transition-transform"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeLinecap="square"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Send button */}
            <div className="ml-auto flex flex-row items-end gap-1">
              <button
                className={`group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  isLoading || !input.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }`}
                type="submit"
                aria-label="Submit"
                disabled={isLoading || !input.trim()}
              >
                <div className="h-9 relative aspect-square flex flex-col items-center justify-center rounded-full ring-inset before:absolute before:inset-0 before:rounded-full before:bg-primary before:ring-0 before:transition-all duration-500 bg-gray-700 text-gray-400 before:[clip-path:circle(0%_at_50%_50%)] ring-0">
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-gray-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-[2] relative"
                    >
                      <path
                        d="M5 11L12 4M12 4L19 11M12 4V21"
                        stroke="currentColor"
                      ></path>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GrokInput;
