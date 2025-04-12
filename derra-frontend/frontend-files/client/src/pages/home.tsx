import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: featuredBusinesses } = useQuery({
    queryKey: ["/api/businesses/featured"],
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Welcome to Derra - World of Business
      </h1>
      
      {/* Featured Businesses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBusinesses?.map((business: any) => (
            <div 
              key={business.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                {business.coverImage ? (
                  <img 
                    src={business.coverImage} 
                    alt={business.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{business.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{business.address}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{business.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Explore Business Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories?.map((category: any) => (
            <div 
              key={category.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center text-blue-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="font-medium text-center">{category.name}</span>
              <span className="text-xs text-gray-500">{category.businessCount || 0} listings</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}