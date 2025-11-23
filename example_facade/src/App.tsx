import { SearchEngine } from "courses-data";
import { useMemo, useState } from "react";
import CourseCard from "./CourseCard";
import favicon from './favicon.png';

export function App() {
  const search = useMemo(
    () => new SearchEngine(["/api/lunr-index", "/api/courses-data"]),
    []
  );
  const [response, setResponse] = useState<any[]>([]);

  return (
    <div className="app">
      {/* 
      The pedagogical example in the `example` folder basically
      just runs the following code. This massive example is a facade
      around basically the exact same code.
      
      <input onChange={(e) => setResponse(search.query(e.target.value))} />
      {response.slice(0, 10).map((course) => {
        return (
          <p>
            {course.id}: {course.name} | {course.desc}
          </p>
        );
      })} */}
      <div id="__next">
      <div className="accent-blue-600 flex flex-col md:h-screen min-h-screen">
        <div
          data-rht-toaster=""
          /* WAUGH 
            position: fixed;
            z-index: 9999;
            inset: 16px;
            pointer-events: none;
           HGUAW */
        ></div>
        <header
          className="sticky top-0 border-b drop-shadow bg-gray-50 border-gray-200 zinc-800 z-10"
        >
          <div className="">
            <div
              className="flex flex-row items-center justify-between p-6 bg-gray-50 h-16"
            >
              <div
                className="flex flex-initial cursor-pointer flex-row justify-start font-semibold text-gray-800"
              >
                <a href="/"
                  ><span
                    className="cursor-pointer underline decoration-gray-200 hover:no-underline"
                    ><div className="flex items-center">
                      <img
                        alt="favicon"
                        loading="lazy"
                        width="30"
                        height="30"
                        decoding="async"
                        data-nimg="1"
                        className="rounded"
                        /* WAUGH color: transparent HGUAW */
                        /* WAUGH 
                          /_next/image?url=%2Ffavicon.ico&amp;w=32&amp;q=75 1x,
                          /_next/image?url=%2Ffavicon.ico&amp;w=64&amp;q=75 2x
                         HGUAW */
                        src={favicon}
                      /><span className="ml-2">CMU Courses</span>
                    </div></span
                  ></a
                >
              </div>
              <div
                className="flex flex-row items-center justify-between gap-x-2 text-gray-600"
              >
                <div className="cursor-pointer rounded-full p-2 bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-4 w-4 stroke-gray-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div
                  className="cursor-pointer rounded p-2 px-2 py-1 hover:bg-gray-100"
                >
                  <span className="flex cursor-pointer flex-row items-center"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="mr-1 inline h-4 w-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <button /* WAUGH SignOutButton HGUAW */>Sign out</button></span
                  >
                </div>
              </div>
            </div>
          </div>
        </header>
        <main
          className="relative flex flex-1 flex-col md:flex-row md:justify-around md:overflow-hidden"
        >
          <div
            className="bg-white border-gray-100 flex flex-row justify-between gap-y-10 border-r px-6 py-6 md:flex-col md:justify-start lg:items-start lg:gap-y-6 lg:pr-10 lg:pl-6"
          >
            <a href="/"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-blue-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-blue-600 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Search
                </div>
              </div></a
            ><a href="/saved"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-gray-500 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Saved
                </div>
              </div></a
            ><a href="/schedules"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-gray-500 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Schedules
                </div>
              </div></a
            ><a href="/instructors"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-gray-500 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Instructors
                </div>
              </div></a
            ><a href="/geneds"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-gray-500 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Geneds
                </div>
              </div></a
            ><a href="/finals"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-gray-500 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Finals
                </div>
              </div></a
            ><a
              href="https://forms.gle/6vPTN6Eyqd1w7pqJA"
              target="_blank"
              rel="noreferrer"
              ><div
                className="group flex cursor-pointer flex-col items-center lg:flex-row"
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-7 w-7 group-hover:stroke-blue-500 lg:h-6 lg:w-6 stroke-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    ></path>
                  </svg>
                </div>
                <div
                  className="text-gray-500 text-xs group-hover:text-blue-500 lg:ml-2 lg:text-lg"
                >
                  Feedback
                </div>
              </div></a
            >
          </div>
          <div
            className="relative border-r border-gray-100 md:w-72 lg:w-96 overflow-y-auto bg-white"
          >
            <button className="absolute right-3 top-3 md:top-4 md:right-2">
              <div
                className="text-gray-700 cursor-pointer rounded py-1 px-2 text-sm hover:bg-gray-50"
              >
                <div className="hidden items-center md:flex">
                  <div className="mr-1">Hide</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="max-md:flex items-center md:hidden">
                  <div className="mr-2">Hide</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </button>
            <div className="space-y-6 p-6 bg-white text-gray-700 md:space-y-12">
              <div>
                <div className="mb-3 text-lg">Filter by</div>
                <div className="space-y-4 text-sm">
                  <div className="relative mt-1 text-gray-500 text-sm">
                    <label
                      className="flex"
                      /* WAUGH headlessui-combobox-input-«r4» HGUAW */
                      id="headlessui-label-«r2»"
                      data-headlessui-state=""
                      ><div><input className="mr-2" type="checkbox" /></div>
                      Department</label
                    ><button
                      className="relative mt-2 w-full cursor-default rounded border py-1 pl-1 pr-10 text-left transition duration-150 ease-in-out border-gray-200 sm:text-sm sm:leading-5"
                      id="headlessui-combobox-button-«r3»"
                      type="button"
                      /* WAUGH -1 HGUAW */
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      data-headlessui-state=""
                      aria-labelledby="headlessui-label-«r2» headlessui-combobox-button-«r3»"
                    >
                      <span className="flex flex-wrap gap-1"
                        ><span className="p-0.5">None</span
                        ><input
                          className="shadow-xs flex rounded py-0.5 text-base leading-6 bg-white focus:outline-none sm:text-sm sm:leading-5"
                          id="headlessui-combobox-input-«r4»"
                          role="combobox"
                          aria-expanded="false"
                          aria-autocomplete="list"
                          data-headlessui-state=""
                          type="text"
                          value=""
                          aria-labelledby="headlessui-label-«r2»" /></span
                      ><span
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                          className="h-5 w-5 stroke-gray-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          ></path></svg
                      ></span>
                    </button>
                    <div
                      className="absolute mt-1 w-full rounded shadow-lg bg-white"
                    ></div>
                  </div>
                  <div className="mt-2 flex text-gray-500 text-sm">
                    <div><input className="mr-2" type="checkbox" /></div>
                    <div className="mr-6">Units</div>
                    <div className="flex-1">
                   
                        
                    </div>
                    <div className="ml-5 w-10 text-right">0-24</div>
                  </div>
                  <div className="relative mt-1 text-gray-500 text-sm">
                    <label
                      className="flex"
                      /* WAUGH headlessui-listbox-button-«rb» HGUAW */
                      id="headlessui-label-«ra»"
                      data-headlessui-state=""
                      ><div><input className="mr-2" type="checkbox" /></div>
                      Offered in</label
                    ><button
                      className="border-gray-200 relative mt-2 w-full cursor-default rounded border py-1 pl-1 pr-10 text-left transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      id="headlessui-listbox-button-«rb»"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      data-headlessui-state=""
                      aria-labelledby="headlessui-label-«ra» headlessui-listbox-button-«rb»"
                    >
                      <span className="flex flex-wrap gap-1"
                        ><span className="p-0.5">None</span></span
                      ><span
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                          className="h-5 w-5 stroke-gray-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          ></path></svg
                      ></span>
                    </button>
                    <div
                      className="bg-white absolute mt-1 w-full rounded shadow-lg"
                    ></div>
                  </div>
                  <div className="relative mt-1 text-gray-500 text-sm">
                    <label
                      className="flex"
                      /* WAUGH headlessui-listbox-button-«ri» HGUAW */
                      id="headlessui-label-«rh»"
                      data-headlessui-state=""
                      ><div><input className="mr-2" type="checkbox" /></div>
                      Course Level</label
                    ><button
                      className="relative mt-2 w-full cursor-default rounded border py-1 pl-1 pr-10 text-left transition duration-150 ease-in-out border-gray-200 sm:text-sm sm:leading-5"
                      id="headlessui-listbox-button-«ri»"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      data-headlessui-state=""
                      aria-labelledby="headlessui-label-«rh» headlessui-listbox-button-«ri»"
                    >
                      <span className="block flex flex-wrap gap-1"
                        ><span className="p-0.5">None</span></span
                      ><span
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                          className="h-5 w-5 stroke-gray-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          ></path></svg
                      ></span>
                    </button>
                    <div
                      className="absolute mt-1 w-full rounded shadow-lg bg-white"
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lg">Aggregate FCEs</div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-baseline text-gray-500 text-sm">
                    <div className="mr-4 whitespace-nowrap text-sm">
                      Semesters to Show
                    </div>
                    <input
                      className="min-w-0 flex-auto rounded border px-2 py-1 text-sm bg-transparent border-gray-200"
                      type="number"
                      value="20"
                    />
                  </div>
                  <div
                    className="flex flex-row justify-between text-gray-500 text-sm"
                  >
                    <label className="capitalize"
                      ><input className="mr-1" type="checkbox" />
                      spring</label
                    ><label className="capitalize"
                      ><input className="mr-1" type="checkbox" /> summer</label
                    ><label className="capitalize"
                      ><input className="mr-1" type="checkbox" />
                      fall</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto md:h-full">
            <div
              className="bg-white text-gray-700 border-gray-100 sticky top-0 z-10 border-b px-8 py-6"
            >
              <div
                className="relative flex border-b border-b-gray-500 text-gray-500"
              >
                <span className="absolute inset-y-0 left-0 flex items-center"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                      clip-rule="evenodd"
                    ></path></svg></span
                >
                
                {/* <input
                  className="[&amp;::-webkit-search-cancel-button]:appearance-none flex-1 py-2 pl-7 pr-7 text-xl placeholder-gray-300 bg-transparent focus:outline-none"
                  placeholder="Search courses by ID, description, name or keyword..."
                  type="search"
                  value=""
                /> */}
                <input 
                  className="[&amp;::-webkit-search-cancel-button]:appearance-none flex-1 py-2 pl-7 pr-7 text-xl placeholder-gray-300 bg-transparent focus:outline-none" 
                  onChange={(e) => setResponse(search.query(e.target.value))} 
                />
              </div>
              <div className="flex justify-between">
                <div className="mt-3 text-sm text-gray-500">{response.length} results</div>
                <div
                  className="mt-3 grid grid-flow-row-dense grid-cols-2 text-gray-500 text-sm md:flex md:justify-end"
                >
                  <div className="mr-2 md:mr-6">
                    <input id="selectAll" className="mr-2" type="checkbox" /><span
                      >All</span
                    >
                  </div>
                  <div className="mr-2 md:mr-6">
                    <input className="mr-2" type="checkbox" /><span>FCEs</span>
                  </div>
                  <div className="mr-2 md:mr-6">
                    <input className="mr-2" type="checkbox"  /><span
                      >Course&nbsp;Info</span
                    >
                  </div>
                  <div className="mr-2 md:mr-6">
                    <input className="mr-2" type="checkbox" /><span>Schedules</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-gray-500">
                <div className="flex justify-between"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* <!-- AAAAAAAAAA HERE!!!!!!!!!! --> */}
                {response
                .slice(0, 10)
                .map((course) => CourseCard({
               code: course.id,
               name: course.name,
               department: course.department,
               units: course.units,
               fce: "???",
               description: course.desc
                }))}
              </div>
              <div className="mx-auto my-6">
                <div className="text-gray-600 flex w-full justify-center">
                  <button className="" >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="h-5 w-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      ></path>
                    </svg>
                  </button>
                  <div className="flex items-center align-baseline">
                    <span
                      className="mx-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white bg-gray-300"
                      >1</span
                    ><span
                      className="mx-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                      >2</span
                    ><span
                      className="mx-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                      >3</span
                    ><span
                      className="mx-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                    
                    >...</span
                    >
                    {/* <span
                      className="mx-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                      >815</span
                    ><span
                      className="mx-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                      >816</span
                    > */}
                  </div>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="h-5 w-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer
          className="border-t lg:px-8 md:py-4 md:px-4 p-4 pb-8 text-sm text-gray-500 bg-gray-50 border-gray-100"
        >
          <div className="max-w-4xl">
            <p>
              Designed, developed and maintained with ❤️ by
              <a href="https://scottylabs.org"
                ><span
                  className="cursor-pointer underline decoration-gray-200 hover:no-underline"
                  >ScottyLabs</span
                ></a
              >.
            </p>
            <p>
              Want to help us make CMU Courses better? Join us at ScottyLabs or
              make a pull request on our
              <a href="https://github.com/ScottyLabs/course-tool"
                ><span
                  className="cursor-pointer underline decoration-gray-200 hover:no-underline"
                  >GitHub repository</span
                ></a
              >.
            </p>
          </div>
        </footer>
      </div>
    </div>
    </div>
  );
}

export default App;
