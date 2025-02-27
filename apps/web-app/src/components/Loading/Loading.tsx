const Loading = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <>
      {isLoading && (
        <div className="fixed z-[1000] inset-0 flex items-center flex-col justify-center bg-[#0b0e149e]">
          <div className="relative flex h-[285px] w-[195px] cursor-pointer flex-col items-center justify-center rounded-2xl text-white transition-transform duration-200 ease-in-out">
            <svg
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.37 1277.39"
              clipRule="evenodd"
              fillRule="evenodd"
              imageRendering="optimizeQuality"
              textRendering="geometricPrecision"
              shapeRendering="geometricPrecision"
              version="1.1"
              height="100%"
              width="100%"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute h-[30%] z-10 ease-in-out animate-float"
            >
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer" />
                <g id="_1421394342400">
                  <g>
                    <polygon
                      points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                      fillRule="nonzero"
                      fill="#343434"
                    />
                    <polygon
                      points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"
                      fillRule="nonzero"
                      fill="#8C8C8C"
                    />
                    <polygon
                      points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                      fillRule="nonzero"
                      fill="#3C3C3B"
                    />
                    <polygon
                      points="392.07,1277.38 392.07,956.52 -0,724.89"
                      fillRule="nonzero"
                      fill="#8C8C8C"
                    />
                    <polygon
                      points="392.07,882.29 784.13,650.54 392.07,472.33"
                      fillRule="nonzero"
                      fill="#141414"
                    />
                    <polygon
                      points="0,650.54 392.07,882.29 392.07,472.33"
                      fillRule="nonzero"
                      fill="#393939"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
