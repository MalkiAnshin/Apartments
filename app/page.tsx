// app/page.tsx
const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to SCHLOSS</h1>
      <p className="text-lg mb-4">Find the perfect property or land that suits your needs.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card examples */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Property 1</h2>
          <p className="text-gray-600">Details about property 1.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Property 2</h2>
          <p className="text-gray-600">Details about property 2.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Property 3</h2>
          <p className="text-gray-600">Details about property 3.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
