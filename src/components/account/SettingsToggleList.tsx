"use client";

import { AccountScreen } from "@/components/account/AccountScreen";
import { Toggle } from "@/components/ui/Toggle";
import { useAccountSettings, type AccountSettings } from "@/lib/account";
import type { Crumb } from "@/components/layout/Breadcrumbs";

export interface SettingRow {
  key: keyof AccountSettings;
  label: string;
  hint: string;
}

/**
 * A list of switches. Both settings screens are the same shape, so they share
 * one component and differ only in their rows — changes save immediately
 * rather than behind a Save button, which is what a switch implies.
 */
export function SettingsToggleList({
  title,
  description,
  crumbs,
  groups,
}: {
  title: string;
  description: string;
  crumbs: Crumb[];
  groups: { heading: string; rows: SettingRow[] }[];
}) {
  const { settings, set, hydrated } = useAccountSettings();

  return (
    <AccountScreen
      title={title}
      description={description}
      crumbs={crumbs}
      ready={hydrated}
    >
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.heading}>
            <h2 className="text-fg-subtle mb-2.5 text-[11.5px] font-extrabold tracking-wide uppercase">
              {group.heading}
            </h2>

            <ul className="border-hairline bg-surface overflow-hidden rounded-3xl border-2">
              {group.rows.map((row) => (
                <li
                  key={row.key}
                  className="border-hairline flex items-center gap-4 border-b px-5.5 py-4.5 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-fg text-[14.5px] font-bold">{row.label}</p>
                    <p className="text-fg-subtle mt-0.5 text-[12.5px] leading-relaxed">
                      {row.hint}
                    </p>
                  </div>
                  <Toggle
                    checked={settings[row.key]}
                    onChange={(value) => set(row.key, value)}
                    label={row.label}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AccountScreen>
  );
}
