import { Layer1Button } from "@/element/buttons";
import { FormattedMessage } from "react-intl";
import { Outlet, useNavigate } from "react-router-dom";

const Tabs = [
  {
    name: <FormattedMessage defaultMessage="Account" id="TwyMau" />,
    path: "",
  } as const,
  {
    name: <FormattedMessage defaultMessage="Stream" id="uYw2LD" />,
    path: "stream",
  } as const,
];
export default function SettingsPage() {
  const naviage = useNavigate();

  return (
    <div className="rounded-2xl p-3 md:w-[700px] mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1>
          <FormattedMessage defaultMessage="Settings" id="D3idYv" />
        </h1>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {Tabs.map(t => (
              <Layer1Button onClick={() => naviage(t.path)}>{t.name}</Layer1Button>
            ))}
          </div>
          <div className="p-5 bg-layer-1 rounded-3xl flex flex-col gap-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
