import { AiBooksLinks, BooksLinks } from "@/app/page";
import { IoMdArrowDropright } from "react-icons/io";
import { FiBookOpen } from "react-icons/fi";

// TODO: 有call summary的時候，才顯示正在生成結果
function SearchResultsSection({
  isLoading,
  // isSummary,
  title,
  icon,
  results,
}: {
  isLoading: boolean;
  title: string;
  icon: React.ReactNode;
  results: BooksLinks[] | AiBooksLinks[];
}) {
  return (
    <div className="p-4 rounded-lg h-full border border-gray-300 bg-opacity-50">
      <h3 className="text-xl font-semibold mb-3 flex items-center border-b-2 pb-2 border-gray-300">
        {icon}
        {title}
      </h3>
      <div className="h-[55vh] overflow-y-auto">
        <ul className="space-y-4">
          {/* <div className="flex items-center justify-center h-24">
            <p className="text-gray-500">正在生成结果...</p>
          </div> */}
          {isLoading && results.length === 0 ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-gray-500">正在生成结果...</p>
            </div>
          ) : (
            results?.map((book: BooksLinks | AiBooksLinks, index: number) => (
              <li key={index} className="flex w-full">
                <div
                  key={index}
                  onClick={() => {
                    window.open(book.link, "_blank");
                  }}
                  className="group w-full hover:shadow-lg transition-all duration-300 cursor-pointer shadow border-none bg-gradient-to-r from-amber-50 to-orange-50"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative  overflow-hidden rounded-md shadow-md group-hover:shadow-lg transition-shadow">
                        {"image" in book ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="object-cover w-full h-[120px]"
                          />
                        ) : (
                          <img
                            src="/taaze_default.jpeg"
                            alt="taaze"
                            className="object-contain w-full h-[40px]"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-medium leading-tight text-gray-900 group-hover:text-gray-700">
                            {book.title}
                          </h3>
                          <IoMdArrowDropright className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0 mt-1" />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md hover:bg-orange-200">
                            <FiBookOpen className="w-4 h-4 mr-1" />
                            {/* {book.category} */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {"content" in book ? <p>{book.content}</p> : <></>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default SearchResultsSection;
