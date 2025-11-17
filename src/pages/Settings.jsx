export default function Settings() {
    return (
        <div className=" text-white p-10 flex flex-col gap-[20px]">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Settings</h1>
                <p className="text-gray-400">
                    Manage your account and system preferences.
                </p>
            </header>

            <form className="bg-[#111827] border border-gray-700 rounded-xl p-6  shadow-lg">
                <p className="text-lg font-semibold border-b border-gray-700 pb-3 mb-4">
                    Profile Settings
                </p>

                <div className="flex items-center justify-between mb-6">
                    <label htmlFor="Fname" className="text-sm text-gray-400 w-1/3">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="Fname"
                        placeholder="example: John Doe"
                        className="w-2/3 bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label htmlFor="ChangePassword" className="text-sm text-gray-400 w-1/3">
                        Password
                    </label>
                    <button
                        id="ChangePassword"
                        type="button"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Change Password
                    </button>
                </div>
            </form>

            <form className="bg-[#111827] border border-gray-700 rounded-xl p-6  shadow-lg">
                <p className="text-lg font-semibold border-b border-gray-700 pb-3 mb-4">
                    System Preferences
                </p>

                {/*     Low Stock Alerts  */}
                <div className="mb-6 flex items-center justify-between md:gap-6">
                    <label htmlFor="lowStock" className="text-sm text-gray-400 w-1/3">
                        Low Stock Alerts
                    </label>

                    {/* Toggle */}
                    <button
                        id="lowStock"
                        type="button"
                        aria-pressed="true"
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <span className="sr-only">Enable Low Stock Alerts</span>
                        <span className="translate-x-6 inline-block h-5 w-5 transform rounded-full bg-white transition" />
                    </button>
                </div>

                {/* Currency */}
                <div className="mb-6 flex items-center justify-between md:gap-6">
                    <label htmlFor="currency" className="text-sm text-gray-400 w-1/3">
                        Currency
                    </label>
                    <select
                        id="currency"
                        className="w-2/3 bg-[#1e293b] border border-gray-700 rounded-xl px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="USD"
                    >
                        <option>USD</option>
                        <option>CAD</option>
                        <option>EUR</option>
                        <option>MXN</option>
                    </select>
                </div>

                {/* Timezone */}
                <div className="mb-6 flex items-center justify-between md:gap-6">
                    <label htmlFor="timezone" className="text-sm text-gray-400 w-1/3">
                        Timezone
                    </label>
                    <select
                        id="timezone"
                        className="w-2/3 bg-[#1e293b] border border-gray-700 rounded-xl px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="EST"
                    >
                        <option value="PST">UTC-8:00 Pacific Time</option>
                        <option value="MST">UTC-7:00 Mountain Time</option>
                        <option value="CST">UTC-6:00 Central Time</option>
                        <option value="EST">UTC-5:00 Eastern Time</option>
                    </select>
                </div>

                {/* Date/Time Format */}
                <div className="flex items-center justify-between md:gap-6">
                    <label htmlFor="dtformat" className="text-sm text-gray-400 w-1/3">
                        Date/Time Format
                    </label>
                    <select
                        id="dtformat"
                        className="w-2/3 bg-[#1e293b] border border-gray-700 rounded-xl px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="MM/DD/YYYY"
                    >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                    </select>
                </div>
            </form>

        </div>

    )
}