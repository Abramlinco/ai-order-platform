"use client";

import { ChangeEvent, useEffect, useState } from "react";

type Settings = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  deliveryFee: string;
  lowStockThreshold: string;
  orderNotifications: boolean;
  stockNotifications: boolean;
  deliveryNotifications: boolean;
  darkMode: boolean;
  logo: string;
};

const DEFAULT_SETTINGS: Settings = {
  businessName: "My Business",
  phone: "",
  email: "",
  address: "",
  currency: "NGN",
  deliveryFee: "0",
  lowStockThreshold: "5",
  orderNotifications: true,
  stockNotifications: true,
  deliveryNotifications: true,
  darkMode: false,
  logo: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("businessSettings");

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch {
      // Keep default settings if stored data cannot be read.
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateSetting("logo", reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    updateSetting("logo", "");
  };

  const saveSettings = () => {
    try {
      localStorage.setItem("businessSettings", JSON.stringify(settings));

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch {
      alert("Unable to save settings.");
    }
  };

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Reset all business settings to their default values?"
    );

    if (!confirmed) return;

    localStorage.removeItem("businessSettings");
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-emerald-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    );
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        settings.darkMode ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <section
        className={`border-b transition-colors ${
          settings.darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1
            className={`text-3xl font-bold ${
              settings.darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Settings
          </h1>

          <p
            className={`mt-2 ${
              settings.darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Manage your business profile, preferences and notifications.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Business Profile */}
        <section
          className={`mb-6 rounded-2xl border shadow-sm transition-colors ${
            settings.darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2
              className={`text-xl font-bold ${
                settings.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Business Profile
            </h2>

            <p
              className={`mt-1 text-sm ${
                settings.darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              This information identifies your business across the platform.
            </p>
          </div>

          <div className="p-5">
            {/* Logo */}
            <div className="mb-8">
              <label
                className={`text-sm font-semibold ${
                  settings.darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Business Logo
              </label>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border ${
                    settings.darkMode
                      ? "border-slate-700 bg-slate-800"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {settings.logo ? (
                    <img
                      src={settings.logo}
                      alt="Business logo"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-emerald-600">
                      +
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex cursor-pointer rounded-lg border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    {settings.logo ? "Change Logo" : "Upload Logo"}
                  </label>

                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  {settings.logo && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}

                  <p
                    className={`mt-2 text-xs ${
                      settings.darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    PNG, JPG or WEBP. Maximum 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Business Name
                </label>

                <input
                  value={settings.businessName}
                  onChange={(e) =>
                    updateSetting("businessName", e.target.value)
                  }
                  placeholder="e.g. Abraham Fashion Store"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Business Phone
                </label>

                <input
                  value={settings.phone}
                  onChange={(e) =>
                    updateSetting("phone", e.target.value)
                  }
                  placeholder="e.g. 0802 123 4567"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Business Email
                </label>

                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    updateSetting("email", e.target.value)
                  }
                  placeholder="business@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Business Address
                </label>

                <input
                  value={settings.address}
                  onChange={(e) =>
                    updateSetting("address", e.target.value)
                  }
                  placeholder="Business location"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Business Preferences */}
        <section
          className={`mb-6 rounded-2xl border shadow-sm ${
            settings.darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="border-b border-slate-200 p-5">
            <h2
              className={`text-xl font-bold ${
                settings.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Business Preferences
            </h2>

            <p
              className={`mt-1 text-sm ${
                settings.darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Configure the basic rules used by your business.
            </p>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currency
              </label>

              <select
                value={settings.currency}
                onChange={(e) =>
                  updateSetting("currency", e.target.value)
                }
                className={inputClass}
              >
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="USD">USD — US Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Default Delivery Fee
              </label>

              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) =>
                  updateSetting("deliveryFee", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Low Stock Alert At
              </label>

              <input
                type="number"
                min="0"
                value={settings.lowStockThreshold}
                onChange={(e) =>
                  updateSetting("lowStockThreshold", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section
          className={`mb-6 rounded-2xl border shadow-sm ${
            settings.darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="border-b border-slate-200 p-5">
            <h2
              className={`text-xl font-bold ${
                settings.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Notifications
            </h2>

            <p
              className={`mt-1 text-sm ${
                settings.darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Choose the business events you want to be notified about.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  New Orders
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Get notified when a new customer order arrives.
                </p>
              </div>

              <Toggle
                checked={settings.orderNotifications}
                onChange={(value) =>
                  updateSetting("orderNotifications", value)
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Stock Alerts
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Receive alerts when products reach the low-stock level.
                </p>
              </div>

              <Toggle
                checked={settings.stockNotifications}
                onChange={(value) =>
                  updateSetting("stockNotifications", value)
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Delivery Updates
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Receive updates about rider and delivery activity.
                </p>
              </div>

              <Toggle
                checked={settings.deliveryNotifications}
                onChange={(value) =>
                  updateSetting("deliveryNotifications", value)
                }
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section
          className={`mb-6 rounded-2xl border shadow-sm ${
            settings.darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="border-b border-slate-200 p-5">
            <h2
              className={`text-xl font-bold ${
                settings.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Appearance
            </h2>

            <p
              className={`mt-1 text-sm ${
                settings.darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Choose how the dashboard should look.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <h3
                className={`font-semibold ${
                  settings.darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Dark Mode
              </h3>

              <p
                className={`mt-1 text-sm ${
                  settings.darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Switch between the light and dark dashboard appearance.
              </p>
            </div>

            <Toggle
              checked={settings.darkMode}
              onChange={(value) => updateSetting("darkMode", value)}
            />
          </div>
        </section>

        {/* Account */}
        <section
          className={`mb-6 rounded-2xl border shadow-sm ${
            settings.darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="border-b border-slate-200 p-5">
            <h2
              className={`text-xl font-bold ${
                settings.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Account
            </h2>

            <p
              className={`mt-1 text-sm ${
                settings.darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Manage your dashboard account.
            </p>
          </div>

          <div className="p-5">
            <div
              className={`rounded-xl border p-4 ${
                settings.darkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-sm text-slate-500">Account type</p>

              <p
                className={`mt-1 font-semibold ${
                  settings.darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Business Owner
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            {saved ? (
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Settings saved successfully
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Save your changes when you're finished.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={saveSettings}
              className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}