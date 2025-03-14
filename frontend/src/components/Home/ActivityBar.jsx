export default function ActivityBar(){
    return(
        <div className="flex items-center justify-center m-[3%]">
              <div className="bg-white shadow-lg rounded-full flex items-center p-3 w-[1200px] h-[110px]">
                
                {/* Location Section */}
                <div className="flex-1 flex items-center space-x-3 px-6 border-r">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-map-pin">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Location</p>
                    <p className="text-gray-500 text-sm">Where To Next?</p>
                  </div>
                </div>
        
                {/* Activity Section */}
                <div className="flex-1 flex items-center space-x-3 px-6 border-r">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-swimming">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M16 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                      <path d="M6 11l4 -2l3.5 3l-1.5 2" />
                      <path d="M3 16.75a2.4 2.4 0 0 0 1 .25a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 1 -.25" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Activity</p>
                    <p className="text-gray-500 text-sm">Select Activity</p>
                  </div>
                </div>
        
                {/* Tour Section */}
                <div className="flex-1 flex items-center space-x-3 px-6">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plane">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Tour</p>
                    <p className="text-gray-500 text-sm">Select Type</p>
                  </div>
                </div>
        
                {/* Button */}
                <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center hover:opacity-80">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"></circle>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"></path>
                  </svg>
                </button>
        
              </div>
            </div>
    )
}