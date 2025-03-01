import NoData from "@/assets/icons/NoData";

const Nodata = () => {
  return (
    <div className="flex items-center justify-center flex-col min-h-150  col-span-2">
      <NoData />
      <div className="mt-4 text-[16px] font-semibold">
        There are no such farms.
      </div>
      <div className="mt-3 mb-4 text-[12px]">There are no such farms.</div>
    </div>
  );
};

export default Nodata;
