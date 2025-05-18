import { useState } from "react";

const TxLogs = () => {
  const [selectedFormat, setSelectedFormat] = useState<"Dec" | "Hex">("Dec");

  // Mock data for demonstration
  const logData = {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    name: "Transfer",
    topics: [
      {
        id: 0,
        value:
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      },
      {
        id: 1,
        from: "0x89e51fa8ca5d66cd220baed62e01e8951aa7c40",
      },
      {
        id: 2,
        to: "0xbdcc289e84b85d5c4483e5cc8199984c057aa2f",
      },
    ],
    value: "1640293400",
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-headerMain">
      <h2 className="text-xl font-semibold mb-4">
        Transaction Receipt Event Logs
      </h2>

      <div className="space-y-4">
        {/* Address Section */}
        <div className="flex items-center gap-2">
          <span className="min-w-[100px] font-medium">Address</span>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">
              {logData.address}
            </span>
            <span className="text-gray-500">(Tether: USDT Stablecoin)</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Name Section */}
        <div className="flex items-center gap-2">
          <span className="min-w-[100px] font-medium">Name</span>
          <div className="flex items-center gap-2">
            <span>Transfer</span>
            <span className="text-gray-600">
              (index_topic_1 address from, index_topic_2 address to, uint256
              value)
            </span>
            <button className="text-blue-500 hover:underline">
              View Source
            </button>
          </div>
        </div>

        {/* Topics Section */}
        <div className="flex items-start gap-2">
          <span className="min-w-[100px] font-medium">Topics</span>
          <div className="space-y-2 flex-1">
            {logData.topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-500 min-w-[40px]">{index}:</span>
                <span className="font-mono text-sm break-all">
                  {topic.value || topic.from || topic.to}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Section */}
        <div className="flex items-center gap-2">
          <span className="min-w-[100px] font-medium">Data</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">value: {logData.value}</span>
            <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
              <button
                className={`px-2 py-1 rounded ${selectedFormat === "Dec" ? "bg-white shadow" : ""}`}
                onClick={() => setSelectedFormat("Dec")}
              >
                Dec
              </button>
              <button
                className={`px-2 py-1 rounded ${selectedFormat === "Hex" ? "bg-white shadow" : ""}`}
                onClick={() => setSelectedFormat("Hex")}
              >
                Hex
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxLogs;
