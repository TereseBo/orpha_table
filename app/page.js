import { Options } from "@/components/options";
import { InputField } from "@/components/inputfield";
import { Results } from "@/components/results";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Options/>
      <InputField/>
      <Results/>

    </main>
  );
}
