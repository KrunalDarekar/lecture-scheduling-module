
const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="border p-2 w-[350px] mb-4 rounded border border-yellow-600 text-yellow-700 bg-yellow-100">
                render.com's free servers shut down after 15 minutes of inactivity, you might need to wait for upto 50 seconds for the requests to go through
            </div>
            <div className="flex justify-center items-center text-lg font-semibold gap-4">
                <div className="w-6 h-6 border-2 border-black border-t-white rounded-full animate-spin"></div>
                Loading...
            </div>
        </div>
    )
};

export default Loader
