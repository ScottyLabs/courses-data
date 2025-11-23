{/* 
48-025
First Year Seminar: Architecture Edition
Architecture
3 units
3.5 hrs/week
F 2025, F 2024
pre/co/crosslist
descr
         */}
export default function CourseCard({
  code,
  name,
  department,
  units,
  fce,
  description
}: any) {
    return (
        <div className="bg-white border-gray-100 rounded border p-6">
                  <div className="grid auto-rows-min grid-cols-8 gap-x-6 gap-y-2">
                    <div
                      className="col-span-5 col-start-1 row-span-1 row-start-1 md:col-span-6"
                    >
                      <a href="/course/48-025"
                        ><div className="cursor-pointer text-lg text-gray-800">
                          <span
                            className="mr-2 inline-block whitespace-nowrap font-semibold"
                            >{code}</span
                          ><span className="leading-3"
                            >{name}</span
                          >
                        </div></a
                      >
                      <div className="text-sm text-gray-500">{department}</div>
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <div className="flex flex-row justify-between">
                        <div>
                          <div className="text-lg text-gray-700">{units} units</div>
                        </div>
                        <div>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                              data-slot="icon"
                              className="h-6 w-6"
                              data-tooltip-id="48-025-bookmark"
                              data-tooltip-place="bottom-end"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="text-md text-gray-500">{fce} hrs/week</div>
                    </div>
                    <div
                      className="col-span-full text-gray-700 md:col-span-2 md:col-start-7"
                    >
                      <div className="text-md mb-1 hidden md:block">
                        F 2025, F 2024
                      </div>
                      <div
                        className="flex flex-row justify-between space-x-4 md:flex-col md:space-x-0 md:space-y-2"
                      >
                        <div>
                          <div className="font-semibold">
                            Prereq<span className="hidden lg:inline">uisite</span>s
                          </div>
                          <div className="text-md text-gray-500">None</div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            Coreq<span className="hidden lg:inline">uisite</span>s
                          </div>
                          <div className="text-md text-gray-500">None</div>
                        </div>
                        <div>
                          <div className="font-semibold">Crosslisted</div>
                          <div className="text-md text-gray-500">None</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-span-full row-span-1 row-start-3 text-sm leading-relaxed text-gray-600 md:col-span-6 md:row-start-2"
                    >
                      {description}
                    </div>
                  </div>
                  <div className="m-auto space-y-4"></div>
                </div>
    )
}