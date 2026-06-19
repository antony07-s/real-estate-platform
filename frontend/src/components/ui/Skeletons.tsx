// Leads Page Shimmer 
export const LeadsShimmer = () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="h-16 bg-white shadow-sm" />
        <div className="max-w-4xl mx-auto px-3 py-6 sm:px-4 sm:py-8 flex-1 w-full">
            <div className="h-4 w-32 max-w-full bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-7 w-52 max-w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 max-w-full bg-gray-100 rounded animate-pulse mb-6" />
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-3">
                            <div className="min-w-0 flex-1">
                                <div className="h-5 w-48 max-w-full bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-3 w-32 max-w-full bg-gray-100 rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-20 max-w-full bg-gray-200 rounded-full animate-pulse" />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="h-4 w-28 max-w-full bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-3 w-24 max-w-full bg-gray-100 rounded animate-pulse mb-1" />
                                <div className="h-3 w-32 max-w-full bg-gray-100 rounded animate-pulse" />
                            </div>
                            <div className="h-8 w-full sm:w-28 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// Properties page Shimmer

export const PropertiesShimmer = () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="h-16 bg-white shadow-sm" />
        <div className="max-w-7xl mx-auto px-3 py-6 sm:px-4 sm:py-8 flex-1 w-full">
            <div className="h-7 w-52 max-w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-40 max-w-full bg-gray-100 rounded animate-pulse mb-6" />
            {/* Filter bar shimmer */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-9 w-full sm:w-28 bg-gray-200 rounded-lg animate-pulse" />
                ))}
            </div>
            {/* Grid shimmer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="h-48 bg-gray-200 animate-pulse" />
                        <div className="p-4 min-w-0">
                            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-3" />
                            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-3" />
                            <div className="grid grid-cols-3 gap-3">
                                <div className="h-4 min-w-0 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 min-w-0 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 min-w-0 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// Property Detail Shimmer 
export const PropertyDetailShimmer = () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="h-16 bg-white shadow-sm" />
        <div className="max-w-7xl mx-auto px-3 py-6 sm:px-4 sm:py-8 flex-1 w-full">
            {/* Image shimmer */}
            <div className="rounded-xl h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left */}
                <div className="lg:col-span-2">
                    <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mb-3" />
                    <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-4" />
                    <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-6" />
                    {/* Features */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-white rounded-xl p-4 sm:p-5 shadow-sm mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                                <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 w-full max-w-16 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                    {/* Description */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
                {/* Right - Inquiry shimmer */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                    <div className="h-24 w-full bg-gray-100 rounded animate-pulse mb-4" />
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    </div>
)

const SkField = () => (
    <div className="flex flex-col gap-1">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 bg-gray-200 rounded-lg animate-pulse" />
    </div>
);

// Edit Property Shimmer
export const EditPropertyShimmer = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="h-16 bg-white shadow-sm" />
            <div className="max-w-2xl mx-auto px-3 py-6 sm:px-4 sm:py-10 flex-1 w-full">
                <div className="h-7 w-40 max-w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-52 max-w-full bg-gray-100 rounded animate-pulse mb-6" />

                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-5">
                    <SkField />

                    {/* Description textarea */}
                    <div className="flex flex-col gap-1">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-[72px] bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    {/* Price + Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SkField /><SkField />
                    </div>

                    {/* Bedrooms / Bathrooms / Area */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SkField /><SkField /><SkField />
                    </div>

                    {/* City / Locality / Address */}
                    <SkField /><SkField /><SkField />

                    {/* Image */}
                    <div className="flex flex-col gap-1">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    {/* Button */}
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-2" />
                </div>
            </div>
        </div>
    );
};
