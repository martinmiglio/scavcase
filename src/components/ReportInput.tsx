import InputSelector from "@/components/InputSelector";
import ItemSearch from "@/components/ItemSearch";
import Button from "@/components/atomic/Button";

export default function ReportInput() {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center justify-between">
        <h2 className="text-2xl">Report a scav case</h2>
        <Button>Submit</Button>
      </span>
      <InputSelector />
      <ItemSearch />
    </div>
  );
}
