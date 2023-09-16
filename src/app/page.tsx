import CostValueScatter from "@/components/charts/CostValueScatter";
import InputItemChart from "@/components/charts/InputItemChart";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <InputItemChart />
      <CostValueScatter />
    </div>
  );
}
