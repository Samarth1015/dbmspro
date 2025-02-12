import { redirect } from "next/navigation";

export default function Staffi() {
  let redirectTo = async () => {
    redirect("/add");
  };
  return (
    <div>
      <button onClick={redirectTo}>Add data</button>
    </div>
  );
}
