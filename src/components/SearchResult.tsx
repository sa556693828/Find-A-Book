import { AiBooksLinks, BooksLinks } from "@/app/page";
import { IoMdArrowDropright } from "react-icons/io";
import { FiBookOpen } from "react-icons/fi";

// TODO: 有call summary的時候，才顯示正在生成結果
function SearchResultsSection({
  isStreaming,
  // isSummary,
  title,
  icon,
  results,
}: {
  isStreaming: boolean;
  isSummary: boolean;
  title: string;
  icon: React.ReactNode;
  results: BooksLinks[] | AiBooksLinks[];
}) {
  return (
    <div className="bg-gradient-to-b from-yellow-50 to-amber-100 p-4 rounded-lg border border-gray-300 bg-opacity-50">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        {icon}
        {title}
      </h3>
      <ul className="space-y-4">
        {isStreaming && results.length === 0 ? (
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
                    <div className="relative min-w-[80px] h-[120px] overflow-hidden rounded-md shadow-md group-hover:shadow-lg transition-shadow">
                      {"image" in book ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <img
                          src="/taaze_default.jpeg"
                          alt="taaze"
                          className="object-cover w-full h-full"
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
  );
}

export default SearchResultsSection;
